var http = require('http');
var fs = require('fs');
var util = require('util');
var mime = require('mime-types');
var colors = require('colors');
// Entry point for each request.
function ajax(req, res)
{
	// Response variable.
	var a = 'File Not Found';
	
	var requestdata;
	// Fetching url from request.
	var requesturl = req.url;
	// Remove / from start of url.
	requesturl = requesturl.replace('/', '');
	//Variable to store MIME type of file.
	var	responsemimetype;
    // First we Check whether the link is directory or emty.
	// If it is then load index.html.
	try{
		if( req.method === 'GET')
		{
			/*
			fs.writeFile("requestone.json", util.inspect(req),
						function(err)
						{
							if(err == undefined)
							{
								console.log("File written successfully.");
							}
						}
					);*/
			if(requesturl == "")
			{
				requesturl = "index.html";
			}
			else{
				var typeofrequest = fs.statSync(requesturl);
				if(typeofrequest.isDirectory())
				{
					requesturl = requesturl + "/index.html";
				}
				
			}
			
			//If particular file is not found send 404 error.
			try
			{
				// initialization of a  would fail when file is not found.
				
				
				a = fs.readFileSync(requesturl);
				
				res.setStatusCode = 200;
				responsemimetype = mime.lookup(requesturl);
			}
			catch(e)
			{
				// No file found.
				a = 'File Not Found';
				res.setStatusCode = 404;
				responsemimetype = "text/html";
				console.log(e);
			}
		}
		else if(req.method ==="POST")
		{
			if(requesturl == "addsomedatatojson")
			{
				req.on('data', function(chunk){
					fs.writeFile("data.json", chunk.toString(),
						function(err)
						{
							if(err == undefined)
							{
								console.log("File written successfully.");
							}
							else{
								console.error(err);
							}
						}
					);
				});
				console.log("PUT REQUEST FOR" + requesturl.data);
				try{
					res.setStatusCode = 200;
					responsemimetype = mime.lookup(requesturl);
					console.log("---------------Success---------", req.url);
				}catch(e)
				{
					console.log("ERRORRRR", e);
					a = 'File Not Found';
					res.setStatusCode = 404;
					responsemimetype = "text/html";
				}
			}
			else{
				console.log('Invalid data');
			}
		}
	}catch(e)
		{
			console.error('Error from put', e);
			a = '<h2>File Not Found</h2>';
			res.setStatusCode = 404;
			responsemimetype = "text/html";
		}	
		// Response Content type.  
			
	res.setHeader('Content-Type', responsemimetype);     
	
	/*
	// For Cross Domain Access.
	res.setHeader('Access-Control-Allow-Origin', '*');
	*/    
  // Sending response.
  console.log("File: ".green, requesturl.red, "Method: ".green,req.method.red,'mime-type: '.green,responsemimetype.red);
  res.end(a);
}

//Creating a webserver at port no 8888.
var httpserver = http.createServer(ajax);
httpserver.listen(8888, '127.0.0.1',
  function()
  {
    console.log('Local host started at 8888');
  }
)