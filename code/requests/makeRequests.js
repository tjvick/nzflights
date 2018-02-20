let fs = require('fs');
let request = require('request');
let path = require('path');
let sleep = require('sleep');

function makeRequests(requests) {
  requests.forEach(function(searchRequest) {
    // show display text
    console.log(searchRequest.displayString)
    // make request
    request(
      searchRequest.requestOptions,
      function(requestError, response, body) {
        // show request error if there is one
        if (requestError) {
          console.log('Request Error:', requestError)
        }

        // show status code
        console.log('statusCode', response && response.statusCode)

        // make sure directory of file specified exists
        let filedir = path.dirname(searchRequest.filepath);
        if (!fs.existsSync(filedir)) {
          fs.mkdirSync(filedir);
        }

        // write body to file specified
        fs.writeFile(
          searchRequest.filepath,
          JSON.stringify(JSON.parse(body), null, '\t'),
          function(writeError) {
            // show write error if there is one
            if (writeError) {
              console.log('Write Error:', writeError)
            }
            console.log('File written: ' + searchRequest.filepath)
          }
        )
      }
    )
  })
}

module.exports.makeRequests = makeRequests;
