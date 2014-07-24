var expect = require('chai').expect,
  express = require('express'),
  GrydDocs = require('../lib/docs.js');

var mod = require('../package.json'),
  config = {
    domain:"http://bobdole.com",
    basePath:"/v1",
    version:"1.0.0",
    docPath:"/api-docs"
  };

express = GrydDocs(express,config);

var app = express();

var models = {
  Person:{
    name:'Person',
    properties:{
      id:{
        type:'integer',
        description:"The person's unique Id",
        required:true
      },
      first_name:{
        type:'string',
        description:"The person's first name",
        required:true
      },
      last_name:{
        type:'string',
        description:"The person's last name",
        required:true
      }
    }
  }
};

var getPerson = {
  description: "Get Person by Id",
  method: "GET",
  parameters:[
    GrydDocs.params.path('id')
  ],
  model: models.Person,
  errors:[
    GrydDocs.errors(404,"No Person with given ID")
  ]
};

var postPerson = {
  description: "Create a new person",
  method: "POST",
  parameters:[
    GrydDocs.params.body('first_name'),
    GrydDocs.params.body('last_name')
  ],
  model: models.Person,
  errors:[
    GrydDocs.errors(400,"Invalid Input")
  ]
};

var putPerson = {
  description: "Update a person",
  method: "PUT",
  parameters:[
    GrydDocs.params.path('id'),
    GrydDocs.params.body('first_name'),
    GrydDocs.params.body('last_name')
  ],
  model: models.Person,
  errors:[
    GrydDocs.errors(404,"No Person with given ID"),
    GrydDocs.errors(400,"Invalid Input")
  ]
};

var delPerson = {
  description: "Remove a person",
  method: "DELETE",
  parameters:[
    GrydDocs.params.path('id')
  ],
  model: models.Person,
  errors:[
    GrydDocs.errors(404,"No Person with given ID")
  ]
};

var mockPerson = {
  id:10,
  first_name: "Bob",
  last_name: "Dole"
};

app.GrydGet(getPerson,"/person/:id",function(req,res){
  res.json(mockPerson);
});

describe("GrydDocs Express.js Tests",function(){
  it("Should contain all GrydDoc properties",function(done){
    expect(app).to.have.property('GrydAll');
    expect(app).to.have.property('GrydGet');
    expect(app).to.have.property('GrydPost');
    expect(app).to.have.property('GrydPut');
    expect(app).to.have.property('GrydDel');
    expect(app).to.have.property('_GrydDocsAPI');
    expect(app).to.have.property('_GrydConfig');
    done();
  });

  it("Should have an initialized API block with 1 call",function(done){
    expect(app._GrydDocsAPI).to.have.property('GrydDocsVersion').and.equal(mod.version);
    expect(app._GrydDocsAPI).to.have.property('GrydDocsPath').and.equal(config.docPath);
    expect(app._GrydDocsAPI).to.have.property('Domain').and.equal(config.domain);
    expect(app._GrydDocsAPI).to.have.property('APIBasePath').and.equal(config.basePath);
    expect(app._GrydDocsAPI).to.have.property('APIVersion').and.equal(config.version);
    expect(app._GrydDocsAPI).to.have.property('API');
    expect(app._GrydDocsAPI.API).to.have.property('/person').and.have.length(1);

    //Add more calls
    app.GrydPost(postPerson,"/person",function(req,res){
      res.json(mockPerson);
    });

    app.GrydPut(putPerson,"/person/:id",function(req,res){
      res.json(mockPerson);
    });

    app.GrydDel(delPerson,"/person/:id",function(req,res){
      res.json(mockPerson);
    });
    done();
  });

  it("Should have 4 API calls",function(done){
    expect(app._GrydDocsAPI.API).to.have.property('/person').and.have.length(4);
    done();
  });
});