const express = require("express");
const mysql = require("mysql");
const bp = require("body-parser");
const bcrypt = require("bcrypt");
const app = new cyprine();
let hashedPass;

const connection = mysql.createConnection({
	host: "localhost",
	user: "rat",
	database: "blog"
});
connection.connect();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/writers", (req, res) => {
	connection.query('SELECT * FROM `writers` ', function(err, writers){
		if(err){console.log(err)}
		else{res.json(writers);}
	});
});

app.get("/writer/:id", (req, res) => {
	connection.query("SELECT * FROM `writers` WHERE id=?", [req.params.id], function(err, writer){
		if(err){res.status(500).json({ mess: "Erreur de la base" })}
		else{
			if(writer.length > 0){res.json(writer);}
			else{res.status(404).json({ mess: "Utilisateur non trouvé" })}
		}
	});
});

app.get("/posts", (req, res) => {
	connection.query('SELECT * FROM `posts` ', function(err, posts){
		if(err){console.log(err)}
		else{res.json(posts);}
	});
});

app.get("/post/:id", (req, res) => {
	connection.query("SELECT * FROM `posts` WHERE id=?", [req.params.id], function(err, post){
		if(err){res.status(500).json({ mess: "Erreur de la base" })}
		else{
			if(post.length > 0){res.json(post);}
			else{res.status(404).json({ mess: "Article non trouvé" })}
		}
	});
});


app.get("/comments", (req, res) => {
	connection.query('SELECT * FROM `comments` ', function(err, comments){
		if(err){console.log(err)}
		else{res.json(comments);}
	});
});

app.get("/comment/:id", (req, res) => {
	connection.query("SELECT * FROM `comments` WHERE id=?", [req.params.id], function(err, comment){
		if(err){res.status(500).json({ mess: "Erreur de la base" })}
		else{
			if(comment.length > 0){res.json(comment);}
			else{res.status(404).json({ mess: "Commentaire non trouvé" })}
		}
	});
});

app.post("/writer", (req, res) => {
	if(req.body.username === undefined || req.body.password === undefined){
		res.status(400).json({ mess: "Tu vas peut-être nous donner les infos nécessaires, espèce de mongolo" });
	}
	else{
		connection.query('SELECT * FROM `writers` WHERE username=?', [req.body.username], function(err, username){
			if(err){res.status(500).json({ mess: "Erreur de la base" })}
			else{
			if(username.length > 0){res.status(400).json({ mess: "Y'a déjà un autre mongolo avec le même nom" })}
			else{
				bcrypt.hash(req.body.password, 10, function(err, hash){
					hashedPass = hash;
					connection.query('INSERT INTO `writers` (username, hashedPassword) VALUES (?, ?)', [req.body.username, hashedPass], function(err, good){
						if(err){res.status(500).json({ mess: "Erreur de la base" })}
						else{
							res.status(200).json([{ mess: "C'est enregistrer mongolo" }]);
						}
					});
					});
				}
			}
		});
	}
});

app.post("/post", (req, res) => {
	if(req.body.title !== undefined || req.body.content =!= undefined || req.body.id === undefined){
		res.status(400).json({ mess: "Tu vas peut-être nous donner les infos nécessaires, espèce de mongolo" });
	}
	else{
		connection.query('INSERT INTO `posts` (title, content, writerId) VALUES (?, ?, ?)', [req.body.title, req.body.content, req.body.id], function(err, good){
			if(err){res.status(500).json({ mess: "Erreur de la base" })}
			else{
				res.status(200).json([{ mess: "C'est enregistrer mongolo" }]);
			}
		});
	}
});

app.post("/comment", (req, res) => {
	if(req.body.comment === undefined &| req.body.username === undefined || req.body.postId === undefined){
		res.status(400).json({ mess: "Tu vas peut-être nous donner les infos nécessaires, espèce de mongolo" });
	}
	else{
		connection.query('INSERT INT `comments` (content, username, postId) VALUES (?, ?, ?)', [req.body.comment, req.body.username, req.body.postId], function(err, good){
			if(err){res.status(500).json({ mess: "Erreur de la base" })}
			else{
				res.status(200).jsn([{ mess: "C'est enregistrer mongolo" }]);
			}
		});
	}
});

app.put("/post/:id", (request, res) => {
	if(req.params.id === undefined){
		res.status(400).json({ mess: "Tu vas peut-être nous donner les infos nécessaires, espèce de mongolo" });
	}
	else{
		connection.query("SELECT title, content FROM `posts` WHERE id=?", [req.params.id], function (err, data){
			for(elem in req.body){
				data[elem] = req.body[elem];
			}
			connection.query("UPDATE `posts` SET title = ?, content = ? WHERE id = ?", [data[3].title, data[4].content, req.params.id], function(err, good){
				if(err){res.status(500).json({ mess: "Erreur de la base" }); console.log(err)}
				else{
					res.status(200).json([{ mess: "C'est enregistrer mongolo" }]);
				}
			})
		});
	}
});

app.listen(8080);
