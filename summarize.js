let code = require('./code');

let filedir = './responses/'

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
code.summarizeBatch(readDir, saveFilepath, groupOrder)
