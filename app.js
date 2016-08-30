/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

var HashMap = require('hashmap');
var ips = new HashMap();

Object.keys(ifaces).forEach(function (ifname) {
                            var alias = 0;
                            
                            ifaces[ifname].forEach(function (iface) {
                                                   if ('IPv4' !== iface.family || iface.internal !== false) {
                                                   // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                                                   return;
                                                   }
                                                   
                                                   if (alias >= 1) {
                                                   // this single interface has multiple ipv4 addresses
                                                   ips.set (ifname + ':' + alias, iface.address);
                                                   } else {
                                                   // this interface has only one ipv4 adress
                                                   ips.set(ifname, iface.address);
                                                   }
                                                   ++alias;
                                                   });
                            });

app.get("/", function (request, response) {
        console.log ("------ GET ----");
        ips.forEach(function (value, key) {
                    response.send(key + ": " + value);
                    });

        });


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function(request, response) {
           // print a message when the server starts listening
           console.log("server starting on " + appEnv.url);
           console.log("IPs: " + ips);
           });
