let req = require('./requests');
let proc = require('./process')

function executeRequests(departureAirports, arrivalAirports, departureDates, filedir) {
  // build requests
  let requests = req.buildRequests(departureAirports, arrivalAirports, departureDates, filedir)

  // make requests
  req.makeRequests(requests)
}

function todaystr() {
  return new Date(Date.now()-5*60*60*1000).toJSON().slice(0,10).replace(/-/g, '');
}

module.exports = {
  executeRequests: executeRequests,
  summarizeBatch: proc.summarizeBatch,
  todaystr: todaystr,
}
