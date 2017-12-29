var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    let userId = req.body.userId;
    let col = db.collection('bt_trades');
    col.find({$or: [{"bookToTrade.owner": userId}, {reqUser: userId}]},
        {_id: 0, bookToTrade: 1, reqUser: 1, reqBook: 1, tradeAccepted: 1}).toArray(function(err, docs) {

        if (err) {
            res.send({message: err});
            return;
        }

        res.send({message: "", trades: docs})
    });
});

module.exports = router;