var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    let userId = req.body.userId;
    let bookNum = req.body.bookNum;

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

        let books = docs[0].books;
        let newBooks = [];

        for(let i = 0; i < books.length; i++){
            if(i != bookNum)
                newBooks.push(books[i]);
        }

        col.updateOne({userId: userId}, {$set: {books: newBooks}}, function(err, r) {
            if (err) {
                res.send({message: err});
                return;
            }

            res.send({message: "", bookNum: bookNum});
        });
    });

});

module.exports = router;