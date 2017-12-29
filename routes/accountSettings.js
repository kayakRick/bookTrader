var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

    let doc = {};
    doc.userId = req.body.userId;
    doc.password = req.body.passwd1;
    doc.name = req.body.name;
    doc.city = req.body.city;
    doc.state = req.body.state;

    if(!doc.userId || !doc.password || !doc.name || !doc.city || !doc.state){
        res.send({message: "One or more fields missing"});
        return;
    }

    let col = db.collection('bt_users');
    col.find({userId: doc.userId}).limit(1).toArray(function(err, docs) {

        if(err) {
            res.send({message: err});
            return;
        }


        if(docs.length == 0){
            res.send({message: "UserId " + doc.userId + " not found"});
            return;
        }

        col.updateOne({userId: doc.userId}, {$set: doc}, function(err, r) {
            if(err) {
                res.send({message: err});
                return;
            }
            else
                res.send({message: ""});
        });

    });
});

module.exports = router;
