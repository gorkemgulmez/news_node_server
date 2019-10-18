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
	password: "password-string",
	database: "yazlab"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Sql connection added!");
});

var newEntry = (nName, nContent, nType, nImage_link, nDate) => {
	var sql = "INSERT INTO news (name, content, type, image_link, like_number, dislike_number, view_count, date) VALUES ?";
	var values = [[nName, nContent, nType, nImage_link, 0, 0, 0, nDate]];
	con.query(sql, [values], function (err, result) {
		if (err) throw err;
		console.log("New Entry Added!\n" + result.affectedRows + " new lines.");
        console.log("Name: " + nName + " Content: " + nContent + " Type: " + nType + " image link: " + nImage_link + " date: " + nDate); 
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

app.get('/api/newslists', (req, res) => {
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

app.get('/api/trends/:num', (req, res) => {
	con.query("SELECT * FROM news ORDER BY view_count DESC LIMIT ?", [parseInt(req.params.num)], function (err, result, fields) {
		if(err) throw err;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});

app.get('/api/10news/:type/:num', (req, res) => {
	con.query("SELECT * FROM news WHERE type=? ORDER BY id DESC LIMIT ?,10", [req.params.type, ((parseInt(req.params.num)-1) * 10 )] , function (err, result, fields) {
		if (err) throw err;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});

app.get('/api/typelists/:type', (req, res) => {
	
	con.query("SELECT * FROM news WHERE type=? ORDER BY id DESC", [req.params.type] , function (err, result, fields) {
		if (err) throw err;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});

app.post('/postentrysuccess', (req, res) => {
    newEntry(req.body.nName, req.body.nContent, req.body.nType, req.body.nImageLink, req.body.nDate);
	fs.readFile('./views/index.html', (err, html) => {
	    res.writeHead(200, {'Content-type': 'text/html'});
        res.end(html);
    });
});

app.post('/like', (req, res) => {
	con.query("SELECT like_number FROM news  WHERE id=?", [parseInt(req.body.id)], function (err, result, fields) {
		if(err) throw err;
		var count = 0;
		Object.keys(result).forEach(function(key) {count = result[key].like_number + 1;});
		con.query("UPDATE news SET like_number=? WHERE id=?", [count, parseInt(req.body.id)], function(err, result, fields) {
			if(err) throw err;
			res.end();
		});
	});
});

app.post('/dislike', (req, res) => {
	con.query("SELECT dislike_number FROM news  WHERE id=?", [parseInt(req.body.id)], function (err, result, fields) {
		if(err) throw err;
		var count = 0;
		Object.keys(result).forEach(function(key) {count = result[key].dislike_number + 1;});
		con.query("UPDATE news SET dislike_number=? WHERE id=?", [count, parseInt(req.body.id)], function(err, result, fields) {
			if(err) throw err;
			res.end();
		});
	});
});

app.post('/view', (req, res) => {
	con.query("SELECT view_count FROM news  WHERE id=?", [parseInt(req.body.id)], function (err, result, fields) {
		if(err) throw err;
		var count = 0;
		Object.keys(result).forEach(function(key) {count = result[key].view_count + 1;});
		con.query("UPDATE news SET view_count=? WHERE id=?", [count, parseInt(req.body.id)], function(err, result, fields) {
			if(err) throw err;
			res.end();
		});
	});
});

var port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server started on port " + port));
