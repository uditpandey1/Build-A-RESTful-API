//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {

    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');                    //connection to database
}

const articleSchema = new mongoose.Schema({                                        //schema of database
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);                          //model of schema

app.route("/articles")

    //fetch all the document

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    //create a new document

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added the document.");
            } else {
                res.send(err);
            }
        });
    })

    //delete all the  document

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfull deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")

    //fetch a document

    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No Match Found.");
            }
        });
    })

    //replace a whole document

    .put(function (req, res) {
        Article.findOneAndUpdate({ title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            },
            { upsert: true },
            function (err) {
                if (!err) {
                    res.send("Successfully Updated.");
                }
            }
        );
    })


    //change only the selected fields in a document

    .patch(function (req, res) {
        Article.findOneAndUpdate({ title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Successfully updated.");
                } else {
                    res.send(err);
                }
            });
    })

    //delete a document

    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (!err) {
                res.send("Successfully deleted.");
            } else {
                res.send(err);
            }
        });
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});