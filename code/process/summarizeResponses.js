let fs = require('fs');
let util = require('util');
let parseResponse = require('./parseResponse.js');

// grab transformResponse code
let transformResponse = parseResponse.transformResponse;

// function for reading date time from fareportallabs
function readDateTime(datetime) {
  let datestring = new Date(Date.parse(datetime.slice(0,9))).toJSON().slice(0,10).replace(/-/g, '')
  return datestring
}

// SUMMARIZE RESPONSE
function summarizeResponse(transformedResponse) {
  // pull departure and arrival airports
  firstFlightLegs = transformedResponse[0].flightLegs;
  let departureAirport = firstFlightLegs[0].departureAirport;
  let arrivalAirport = firstFlightLegs[firstFlightLegs.length-1].arrivalAirport;
  let departureDate = readDateTime(firstFlightLegs[0].departureDateTime);

  // calculate cheapsest flights
  let cheapestFlights = transformedResponse.reduce(function(cheapestSoFar, flight) {
    if (flight.totalFare < cheapestSoFar.fare) {
      return {
        fare: flight.totalFare,
        flights: [
          flight
        ],
      }
    } else if (flight.totalFare === cheapestSoFar.fare) {
      return {
        fare: flight.totalFare,
        flights: [...cheapestSoFar.flights, flight],
      }
    } else {
      return cheapestSoFar;
    }
  }, {
    fare: 10000000,
    flights: [],
  })

  return {
    departureAirport: departureAirport,
    arrivalAirport: arrivalAirport,
    departureDate: departureDate,
    cheapestFare: cheapestFlights.fare,
    cheapestFlights: cheapestFlights.flights,
  }
}


function groupByKey(responseSummaries, summaryKeys) {
  let summaryKey = summaryKeys[0];

  let grouped = {};
  responseSummaries.forEach(function(summary) {
    if (!grouped.hasOwnProperty(summary[summaryKey])) {
      grouped[summary[summaryKey]] = {summaries: []};
    }
    grouped[summary[summaryKey]].summaries.push(summary);
  })

  Object.keys(grouped).forEach(function(groupKey) {
    let cheapestFlights = grouped[groupKey].summaries.reduce(function(cheapestSoFar, summary) {
      if (summary.cheapestFare < cheapestSoFar.fare) {
        return {
          fare: summary.cheapestFare,
          flights: summary.cheapestFlights,
        }
      } else if (summary.cheapestFare === cheapestSoFar.fare) {
        return {
          fare: summary.cheapestFare,
          flights: [...summary.cheapestFlights, ...cheapestSoFar.flights]
        }
      } else {
        return cheapestSoFar
      }
    }, {
      fare: 1000000,
      flights: [],
    })

    Object.assign(grouped[groupKey], {
      cheapestFare: cheapestFlights.fare,
      cheapestFlights: cheapestFlights.flights,
    })
  })

  if (summaryKeys.length > 1) {
    Object.keys(grouped).forEach(function(groupKey) {
      Object.assign(
        grouped[groupKey],
        groupByKey(grouped[groupKey].summaries, summaryKeys.slice(1))
      )
    })
  }

  Object.keys(grouped).forEach(function(groupKey) {
    delete grouped[groupKey].summaries
  })


  return {
    [summaryKey]: grouped,
  }
}



function summarizeBatch(fileRepo, saveFilepath, groupOrder) {
  let responseFiles = fs.readdirSync(fileRepo);

  let responseSummaries = responseFiles.map(function(filename) {
    let filepath = fileRepo + filename;
    // read file
    let responseBody = fs.readFileSync(filepath);
    // transform response
    let transformedResponse = transformResponse(responseBody);
    // summarize response
    let summary = summarizeResponse(transformedResponse);
    return summary
  })

  let grouped = groupByKey(responseSummaries, groupOrder)

  // write summary file
  fs.writeFile(
    saveFilepath,
    JSON.stringify(grouped, null, '\t'),
    function(writeError) {
      if (writeError) {
        console.log('Write Error:', writeError)
      }
      console.log('File written: ' + saveFilepath)
    }
  )

  return grouped
}

module.exports = {
  summarizeBatch: summarizeBatch,
}

// TESTING
function test() {
  let testFile = './responses/test2.json';
  let responseBody = fs.readFileSync(testFile);
  let transformedResponse = transformResponse(responseBody);
  let summary = summarizeResponse(transformedResponse);
  console.log('\nTEST RESPONSE SUMMARY:\n')
  console.log(util.inspect(summary, {depth: null}))

  let testRepo = './responses/20180219/'
  let saveFilepath = './responses/summary_20180219.json'
  let grouped = summarizeBatch(testRepo, saveFilepath)
  console.log('\nTEST BATCH SUMMARY:\n')
  console.log(util.inspect(grouped, {depth: null}))
}


if (require.main === module) {
  test();
}
