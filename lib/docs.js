/**
 * Project Name: GrydValidator
 * Author: Aaron Blankenship
 * Date: 07-24-2014
 *
 * Copyright (c) 2014, Aaron Blankenship

 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee
 * is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
 * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING
 * OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */
var mod = require('../package.json');
exports = module.exports = function (express,config) {
  if (express.hasOwnProperty('application') && config) {
    var app = express.application;
    app.GrydAll = GrydAll;
    app.GrydGet = GrydGet;
    app.GrydPost = GrydPost;
    app.GrydPut = GrydPut;
    app.GrydDel = GrydDel;
    app._GrydDocsAPI = {};
    app._GrydConfig = config;
    return _GrydOverride(express)
  } else {
    throw new SyntaxError("A valid Express.js object and Config object must be provided to initialize GrydDocs.");
  }
};

exports.errors = function(code,reason){
  return {code:code,reason:reason};
};

exports.params = {
  path:function(key){
    return {paramType:'path',field:key};
  },
  body:function(key){
    return {paramType:'body',field:key};
  },
  query:function(key){
    return {paramType:'query',field:key};
  },
  header:function(key){
    return {paramType:'header',field:key};
  }
};

function _GrydDocsConfigure(){
  var config = this._GrydConfig;
  if(!config.hasOwnProperty('basePath'))
    throw new SyntaxError("Config object requires a `basePath` property");
  if(!config.hasOwnProperty('version'))
    throw new SyntaxError("Config object requires a `version` property");
  if(!config.hasOwnProperty('domain'))
    throw new SyntaxError("Config object requires a `domain` property");
  if(!config.hasOwnProperty('docPath'))
    throw new SyntaxError("Config object requires a `docPath` property");

  var middleware = [];

  if(config.hasOwnProperty('middleware'))
    middleware = config.middleware;

  this._GrydDocsAPI = {
    GrydDocsVersion: mod.version,
    GrydDocsPath:config.docPath,
    Domain:config.domain,
    APIBasePath:config.basePath,
    APIVersion: config.version,
    API:{}
  };
  this.get(config.docPath+'/:base?',middleware,_GrydDisplayAPI);
  return this;
}

function _GrydOverride(exp){
  return function(){
    return _GrydDocsConfigure.call(exp());
  };
}

function _GrydDocsUpdateAPI(){
  var spec = arguments[0], route = arguments[1], routeSplit = route.split('/'),
      routeBase = '/'+routeSplit[1];

  spec.route = route;
  if(!this._GrydDocsAPI.API.hasOwnProperty(routeBase)){
    this._GrydDocsAPI.API[routeBase] = [];
  }
  if(spec.hasOwnProperty('parameters')){
    var params = spec.parameters;
    for(var p = 0; p < params.length;p++){
      if(spec.hasOwnProperty('model') && spec.model.properties.hasOwnProperty(params[p].field)){
        var modelField = spec.model.properties[params[p].field];
        params[p].type = modelField.type;
        params[p].required = modelField.required;
      }
    }
  }
  this._GrydDocsAPI.API[routeBase].push(spec);
}

function _GrydDisplayAPI(req,res){
  var api = JSON.parse(JSON.stringify(req.app._GrydDocsAPI)),
      base = req.param('base');
    if(base){
      base = '/'+base;
      api.API = api.API[base] || [];
    }
    res.json(api);
}

function GrydAll() {
  _GrydDocsUpdateAPI.apply(this,arguments);
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  this.all.apply(this,args);
}

function GrydGet() {
  _GrydDocsUpdateAPI.apply(this,arguments);
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  this.get.apply(this,args);
}

function GrydPost() {
  _GrydDocsUpdateAPI.apply(this,arguments);
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  this.post.apply(this,args);
}

function GrydPut() {
  _GrydDocsUpdateAPI.apply(this,arguments);
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  this.put.apply(this,args);
}

function GrydDel() {
  _GrydDocsUpdateAPI.apply(this,arguments);
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  this.delete.apply(this,args);
}