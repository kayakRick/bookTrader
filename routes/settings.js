var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

    let doc = {};
    doc.userId = req.body.userId;

    if(!doc.userId){
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
        
        dbDoc = docs[0];
        res.send({message: "",
            userId: dbDoc.userId,
            password: dbDoc.password,
            name: dbDoc.name,
            city: dbDoc.city,
            state: dbDoc.state});
    });
});

module.exports = router;
