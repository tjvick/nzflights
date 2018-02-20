let code = require('./code');
let fs = require('fs');
let util = require('util');

let filedir = './responses/'

// EXECUTE REQUESTS
// inputs
let departureAirports = ['LAX', 'SFO'];
let arrivalAirports = ['AKL', 'WLG'];
let departureDates = ['2018-12-10', '2018-12-11'];

// run
// code.executeRequests(departureAirports, arrivalAirports, departureDates, filedir)

// SUMMARIZE RESULTS
// inputs
let batchdir = code.todaystr();
let readDir = filedir + batchdir + '/';
let saveFilepath = filedir + `summary_${batchdir}.json`
let groupOrder = [
  'departureDate',
  'arrivalAirport',
  'departureAirport',
]

// run
// code.summarizeBatch(readDir, saveFilepath, groupOrder)
