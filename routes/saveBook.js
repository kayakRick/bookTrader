var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    let book = req.body.book;
    let userId = req.body.userId;
    let col = db.collection('bt_users');
    col.find({userId: userId}).limit(1).toArray(function(err, docs) {

        if (err) {
            res.send({message: err});
            return;
        }

        if (docs.length == 0) {
            res.send({message: "UserId " + userId + " not found"});
            return;
        }

        col.find({userId: userId, "books.title": book.title}).limit(1).toArray(function(err, docs) {
            if (err) {
                res.send({message: err});
                return;
            }

            if (docs.length != 0) {
                res.send({message: book.title + " is already in your collection"});
                return;
            }

            col.updateOne({userId: userId}, {$push: {books: book}}, function(err, r) {
                if (err) {
                    res.send({message: err});
                    return;
                }

                res.send({message: "", book: book})
            });
        });
    });



});

module.exports = router;