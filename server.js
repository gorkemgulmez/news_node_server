var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Create Sql Connection
var con = mysql.createConnection({
	host: "localhost",
	user: "node_root",
	password: "KRyI9zIDqQIgFj15",
	database: "yazlab"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Sql connection added!");
});

var newEntry = (nName, nContent, nType, nImage_link) => {
	var sql = "INSERT INTO news (name, content, type, image_link, like_number, dislike_number, view_count) VALUES ?";
	var values = [[nName, nContent, nType, nImage_link, 0, 0, 0]];
	con.query(sql, [values], function (err, result) {
		if (err) throw err;
		console.log("New Entry Added!\n" + result.affectedRows + " new lines.");
        console.log("Name: " + nName + " Content: " + nContent + " Type: " + nType + " image link: " + nImage_link); 
        console.log([values]);
	});
};

app.get('/*.html', (req, res) => {
    fs.readFile('./views/' + req.params[0] + '.html', (err, html) => {
        if(err) {
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end("404 Not Found");
            return;
        }
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(html);
    });
});

app.get('/', (req, res) => {
	fs.readFile('./views/index.html', (err, html) => {
		res.writeHead(200, {'Content-type': 'text/html'});
		res.end(html);
	});
});
    
app.get('/api/news', (req, res) => {
	con.query("SELECT id FROM news ORDER BY id DESC", function (err, result, fields) {
    	if (err) throw err;
    	res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify(result));
	});
});

app.get('/api/newslists/:id', (req, res) => {
	con.query("SELECT * FROM news WHERE id=?", [req.params.id], function (err, result, fields) {
    	if (err) throw err;
    	res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify(result));
	});
});

app.get('/api/newslists/', (req, res) => {
	con.query("SELECT * FROM news ORDER BY id DESC" , function (err, result, fields) {
    	if (err) throw err;
    	res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify(result));
	});
});


app.get('/api/10news/:num', (req, res) => {
    con.query("SELECT * FROM news ORDER BY id DESC LIMIT ?,10", [((parseInt(req.params.num)-1) * 10 )] , function (err, result, fields) {
        if (err) throw err;
    	res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify(result));
	});
});

app.post('/postentrysuccess', (req, res) => {
    newEntry(req.body.nName, req.body.nContent, req.body.nType, req.body.nImageLink);
	fs.readFile('./views/index.html', (err, html) => {
	    res.writeHead(200, {'Content-type': 'text/html'});
        res.end(html);
    });
});

var port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server started on port " + port));
