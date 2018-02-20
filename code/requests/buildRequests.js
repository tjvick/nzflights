let util = require('util');
let userInfo = require('../../userInfo.js');

// File storage
let todayDatestr = new Date(Date.now()-5*60*60*1000).toJSON().slice(0,10).replace(/-/g, '');

// Build username/password encoded string
let userPass = userInfo.username + ":" + userInfo.password;
let b = new Buffer(userPass);
var userPassEncoded = b.toString('base64');

// FareportalLabs API URL
let fpLabsURL = 'https://api-dev.fareportallabs.com/air/api/search/searchflightavailability';

// request headers
let headers = {
  "Authorization": "Basic " + userPassEncoded,
  "Content-Type": "application/json",
}

// build single request
function buildRequest(departureAirport, arrivalAirport, departureDate, filedir) {
  // post body data
  let bodyJSON = {
    "ResponseVersion": "VERSION41",
    "FlightSearchRequest": {
        "Adults": "1",
        "Child": "0",
        "ClassOfService": "ECONOMY",
        "InfantInLap": "0",
        "InfantOnSeat": "0",
        "Seniors": "0",
        "TypeOfTrip": "ONEWAYTRIP",
        "SegmentDetails": [
                                {
                                "DepartureDate": departureDate,
                                "DepartureTime": "1200",
                                "Origin": departureAirport,
                                "Destination": arrivalAirport,
                                }
                            ]
    }
  }

  // http request options
  let requestOptions = {
    method: "POST",
    uri: fpLabsURL,
    headers: headers,
    body: JSON.stringify(bodyJSON),
  }

  // filepath in which to write response
  let filename = departureAirport + '_' + arrivalAirport + '_' + departureDate.replace(/-/g, '');

  let filepath = filedir + todayDatestr + '/' + filename + '.json';

  // string to display while requesting
  let displayString = `Searching ${departureAirport}-${arrivalAirport} for ${departureDate}...`;

  return {
    requestOptions: requestOptions,
    filepath: filepath,
    displayString: displayString,
  }
}


// build list of requests
function buildRequests(departureAirports, arrivalAirports, departureDates, filedir) {
  // iterate through all possible combinations and build list of requests
  let requests = []
  departureAirports.forEach(function(departureAirport) {
    arrivalAirports.forEach(function(arrivalAirport) {
      departureDates.forEach(function(departureDate) {
        let request = buildRequest(departureAirport, arrivalAirport, departureDate, filedir);
        requests.push(request);
      })
    })
  })

  return requests;
}

// export
module.exports.buildRequests = buildRequests;


// TESTING
function test() {
  let departureAirports = ['LAX', 'SFO'];
  let arrivalAirports = ['AKL', 'WLG'];
  let departureDates = ['2018-12-10', '2018-12-11'];

  let request = buildRequest(departureAirports[0], arrivalAirports[0], departureDates[0]);
  console.log('\nEXAMPLE REQUEST: \n');
  console.log(util.inspect(request, {depth: null}));

  let requests = buildRequests(departureAirports, arrivalAirports, departureDates);
  console.log('\nEXAMPLE REQUESTS: \n');
  console.log(util.inspect(requests, {depth: null}));
}

if (require.main === module) {
  test();
}
