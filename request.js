let code = require('./code');

let filedir = './responses/'

// EXECUTE REQUESTS
// inputs
let arrivalAirports = [
  'LAX',
  'SFO',
  'IAH',
];
let departureAirports = [
  'AKL',
  'WLG',
  'CHC',
  'ZQN',
];
let departureDates = [
  '2019-01-04',
  '2019-01-05',
  '2019-01-06',
  '2019-01-07',
  '2019-01-08',
  '2019-01-09',
  '2019-01-10',
  '2019-01-11',
  '2019-01-12',
  '2019-01-13',
  '2019-01-14',
  '2019-01-15',
  '2019-01-16',
  '2019-01-17',
  '2019-01-18',
  '2019-01-19',
  '2019-01-20',
  '2019-01-21',
  '2019-01-22',
  '2019-01-23',
  '2019-01-24',
  '2019-01-25',
  '2019-01-26',
  '2019-01-27',
  '2019-01-28',
  '2019-01-29',
  '2019-01-30',
  '2019-01-31',
];

// run
code.executeRequests(departureAirports, arrivalAirports, departureDates, filedir)
