'use strict';
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const port = 8080;
let server = http.createServer(function(req, res) {
    let pathName = url.parse(req.url).pathname;
    let filename = path.join(__dirname, pathName);
    if (fs.existsSync(filename)) {
        filename = fs.statSync(filename).isFile() ? filename : filename + 'index.html';
        res.end(fs.readFileSync(filename));
    } else {
        res.writeHead(400, {
            "Content-Type": "text/plain"
        });
        res.end("404 NOT FOUND");
        console.log(pathName + "  " + "404");
    }
});
server.listen(port);
console.log('Server running at port:' + port);