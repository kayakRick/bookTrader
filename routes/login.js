var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

    let doc = {};
    doc.userId = req.body.userId;
    doc.password = req.body.passwd1;

    if(!doc.userId || !doc.password){
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

        if(docs[0].password == doc.password)
            res.send({message: ""});
        else
            res.send({message: "Password not matched"});
    });
});

module.exports = router;
