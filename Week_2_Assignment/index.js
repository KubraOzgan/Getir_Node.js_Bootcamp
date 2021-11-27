//Import core modules

const http = require('http');
const fs = require('fs');

let date = new Date();

//Create server

const server = http.createServer( (req, res) => {

    const url = req.url;

    //Give difference response to different urls

    if(url === '/') 
    {
        console.log();
        //Give status code and html style to response text
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h2>WELCOME TO THE INDEX PAGE</h2>')
    }
    else if(url === '/about')
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h2>WELCOME TO THE ABOUT PAGE</h2>')
    }
    else if(url === '/contact')
    {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h2>WELCOME TO THE CONTACT PAGE</h2>')
    }
    else
    {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('<h2>PAGE NOT FOUND</h2>')
    }

    //Customize log information

    let log = date + `=> ${req.method}: ${url}, status: ${res.statusCode} ` + '\n' + JSON.stringify(req.headers) + '\n';

    fs.appendFile('file.log', log , 'utf8', (err) => {
        if(err) console.log(err);
    });

    res.end();

});

//Define port

const port = 5000;

server.listen(port, () => {
    console.log(`Server started with port ${port}.`);
});
