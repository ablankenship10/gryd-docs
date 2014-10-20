GrydDocs
=========
Autogenerated code documentation API for Express.js applications

### Features
  - Extends the Express.js object
  - Based on Swagger with some deviations to better work within the Gryd architecture
  - All usual Express.js features still available

Installation
----

```js
    npm install gryd-docs
```
Tests
--------------

```js
    npm test
```

Usage
----

##### Extending Express.js
```js
    var express = require('express'),
        GrydDocs = require('gryd-docs');

    //Minimum required configuration
    //The API can be viewed at: http://example.com/api-docs
    //Or view the demo Person resource only at http://example.com/api-docs/person
    var config = {
        domain:"http://example.com",
        basePath:"/v1",
        version:"1.0.0",
        docPath:"/api-docs"
    };

    //Override the Express object with GrydDoc
    //features prior to creating an app
    express = GrydDocs(express,config);

    //Create an express object as usual
    var app = express();

    //Define a response model for our first route
    var Person:{
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
    };

    //Define the API spec for the route
    var getPerson = {
        description: "Get Person by Id",
        method: "GET",
        parameters:[
            GrydDocs.params.path('id')
        ],
        model: Person,
        errors:[
            //Parameters: HTTPStatus Code, Error Code(Optional), Message
            GrydDocs.errors(404, 1000, "No Person with given ID")
        ]
    };

    //Add a new GET route
    app.GrydGet(getPerson,"/person/:id",[middleWare,functions],function(req,res){
        //...
    });

    //Feel free to also add undocumented routes as usual
    app.post('/user/:id/secret',function(req,res){
        //...
    });

    //Start the server!
    app.listen(port);
```


Available functions
----

#### app.GrydGet(methodSpec,route,middleware,callback)
    Wrapper function of Express.js method app.get(); with added `spec` parameter

#### app.GrydPost(methodSpec,route,middleware,callback)
    Wrapper function of Express.js method app.post(); with added `spec` parameter

#### app.GrydPut(methodSpec,route,middleware,callback)
    Wrapper function of Express.js method app.put(); with added `spec` parameter

#### app.GrydDel(methodSpec,route,middleware,callback)
    Wrapper function of Express.js method app.delete(); with added `spec` parameter

#### app.GrydAll(methodSpec,route,middleware,callback)
    Wrapper function of Express.js method app.all(); with added `spec` parameter



Change Log
----
#### 0.1.1
>Added optional error code field to errors helper function

#### 0.1.0
>Initial development


Contributors
----
Aaron Blankenship


License
----

Copyright (c) 2014, Aaron Blankenship

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.