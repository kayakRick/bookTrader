var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    let userId = req.body.userId;
    let col = db.collection('bt_users');
    col.find({userId: userId}, {_id: 0, books: 1}).toArray(function(err, docs) {

        if (err) {
            res.send({message: err});
            return;
        }

        if(docs.length == 0)
            res.send({message: "", books: []});
        else
            res.send({message: "", books: docs[0].books});
    });
});

module.exports = router;