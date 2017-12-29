var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    let userId = req.body.userId;
    let col = db.collection('bt_users');
    col.aggregate([
        { $match: {userId:  {$ne: userId}}},
        { $unwind: "$books" },
        { $project: {_id: 0, userId: 1, title: "$books.title",
            description: "$books.descriptions", image: "$books.image"} },
        { $sort: {"title": 1} }
    ]).toArray(function(err, docs) {

        if (err) {
            res.send({message: err});
            return;
        }

        if(docs.length == 0)
            res.send({message: "", books: []});
        else
            res.send({message: "", books: docs});
    });
});

module.exports = router;