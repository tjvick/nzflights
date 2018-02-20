let fs = require('fs');
let util = require('util');

// TRANSFORM FULL RESPONSE TO SOMETHING MORE USABLE
function transformResponse(responseBody) {
  let responseObject = JSON.parse(responseBody);

  let searchResult = responseObject.FlightResponse.FpSearch_AirLowFaresRS;
  let flightsData = searchResult.OriginDestinationOptions.OutBoundOptions.OutBoundOption;
  let feeData = searchResult.SegmentReference.RefDetails;

  let transformedById = {}

  flightsData.forEach(function(flightInfo) {

    let transformedFlight = flightInfo.FlightSegment.map(function(segmentInfo) {
      return {
        departureAirport: segmentInfo.DepartureAirport.LocationCode,
        arrivalAirport: segmentInfo.ArrivalAirport.LocationCode,
        cabinType: segmentInfo.FlightCabin.CabinType,
        flightClass: segmentInfo.FlightClass.ClassType,
        marketingAirline: segmentInfo.MarketingAirline.Code,
        operatingAirline: segmentInfo.OperatedByAirline.Code,
        flightNumber: segmentInfo.FlightNumber,
        stopAirports: segmentInfo.StopAirports,
        departureDateTime: segmentInfo.DepartureDateTime,
        arrivalDateTime: segmentInfo.ArrivalDateTime,
        flightDuration: segmentInfo.FlightDuration,
        durationType: segmentInfo.FDType,
        stopQuantity: segmentInfo.StopQuantity,
      }
    })

    transformedById[flightInfo.Segmentid] = {
      flightLegs: transformedFlight,
      nStops: transformedFlight.length - 1,
    }
  })

  feeData.forEach(function(feeInfo) {
    let outboundId = feeInfo.OutBoundOptionId;
    if ( transformedById.hasOwnProperty(outboundId) ) {
      Object.assign(
        transformedById[outboundId],
        {
          totalFare: feeInfo.PTC_FareBreakdown.Adult.TotalAdultFare,
          baseFare: feeInfo.PTC_FareBreakdown.Adult.BaseFare,
          taxesAndFees: feeInfo.PTC_FareBreakdown.Adult.TaxesandFees,
          fees: feeInfo.PTC_FareBreakdown.Adult.Fees,
          seatsLeft: feeInfo.CNT.SeatsLeft,
        }
      )
    }
  })


  let transformed = Object.keys(transformedById).map(function(key) {
    // console.log(util.inspect({...transformedById}, {depth: null}))
    return {
      id: key,
      ...transformedById[key]
    }

  })

  return transformed
}

module.exports = {
  transformResponse: transformResponse,
}


function test() {
  let testFile = './responses/test2.json';
  let responseBody = fs.readFileSync(testFile);
  let transformedResponse = transformResponse(responseBody);
  console.log('\nEXAMPLE TRANSFORMED RESPONSE:\n')
  Object.keys(transformedResponse).slice(0, 2).forEach(function(key, ix) {
    console.log(util.inspect(transformedResponse[key], {depth: null}))
  })
}

if (require.main === module) {
  test();
}
