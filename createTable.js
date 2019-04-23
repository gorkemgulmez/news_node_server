var mysql = require("mysql");

var con = mysql.createConnection({
	host: "localhost",
	user: "node_root",
	password: "KRyI9zIDqQIgFj15",
	database: "yazlab"
});

var createDBTable = () => {
    var createTableQ = "create table if not exists news (id bigint auto_increment primary key, name varchar(150) charset utf8, content varchar(2000) charset utf8, type enum('gundem', 'spor', 'ekonomi', 'dunya'), image_link varchar(250) charset utf8, like_number int, dislike_number int) engine=InnoDB default charset utf8";
    con.query(createTableQ, function (err, result) {
        if(err) throw err;
        console.log("Table Created!\n");
    });
}

con.connect(function(err) {
	if (err) throw err;
	console.log("Sql connection added!");
});

createDBTable();
