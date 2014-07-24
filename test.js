var GrydDocs = require('./lib/docs');

var express = GrydDocs(require('express'),{
  domain:"http://bobdole.com",
  basePath:"/v1",
  version:"1.0.0",
  docPath:"/api-docs"
});

var app = express();


console.log("Ready");


