var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    let op = req.body.op;
    let userId = req.body.userId;
    let col = db.collection('bt_trades');
    let trade, tradeAccepted, filter;
    switch (op) {
        case "create":
            let bookToTrade = req.body.bookToTrade;
            let bookForTrade = req.body.bookForTrade;
            let doc = {
                bookToTrade: {title: bookToTrade.title, owner: bookToTrade.userId},
                reqUser: userId,
                reqBook: bookForTrade.title,
                tradeAccepted: null
            };

            col.insertOne(doc, function (err, r) {

                if (err) {
                    res.send({message: err});
                    return;
                }

                res.send({message: ""});

            });
            break;
        case "update":
            trade = req.body.trade;
            tradeAccepted = req.body.tradeAccepted;
            filter = {bookToTrade: trade.bookToTrade, reqUser: trade.reqUser, reqBook: trade.reqBook};
            col.updateOne(filter, {$set: {tradeAccepted: tradeAccepted}}, function (err, r) {

                if (err) {
                    res.send({message: err});
                    return;
                }

                res.send({message: ""});

            });
            break;
        case "delete":
            trade = req.body.trade;
            tradeAccepted = req.body.tradeAccepted;
            filter = {bookToTrade: trade.bookToTrade, reqUser: trade.reqUser, reqBook: trade.reqBook};
            col.deleteOne(filter, function (err, r) {

                if (err) {
                    res.send({message: err});
                    return;
                }

                res.send({message: ""});

            });
            break;
        case "complete":
            trade = req.body.trade;
            getBooks(trade.reqUser, function (requestorBooks) {

                if (requestorBooks.message != "") {
                    res.send({message: requestorBooks.message});
                    return;
                }

                getBooks(trade.bookToTrade.owner, function (requestedBooks) {
                    if (requestedBooks.message != "") {
                        res.send({message: requestedBooks.message});
                        return;
                    }

                    let requestorBookSub = findBook(trade.reqBook, requestorBooks.books);
                    let saveBook = requestorBooks.books[requestorBookSub];
                    let requestedUserBookSub = findBook(trade.bookToTrade.title, requestedBooks.books);
                    requestorBooks.books[requestorBookSub] = requestedBooks.books[requestedUserBookSub];
                    requestedBooks.books[requestedUserBookSub] = saveBook;

                    db.collection('bt_users').updateOne({userId: trade.reqUser},
                        {$set: {books: requestorBooks.books}}, function (err, num) {
                            if (err) {
                                res.send({message: err});
                                return;
                            }

                            db.collection('bt_users').updateOne({userId: trade.bookToTrade.owner},
                                {$set: {books: requestedBooks.books}}, function (err, num) {
                                    if (err) {
                                        res.send({message: err});
                                        return;
                                    }

                                    filter = {
                                        bookToTrade: trade.bookToTrade,
                                        reqUser: trade.reqUser,
                                        reqBook: trade.reqBook
                                    };
                                    col.deleteOne(filter, function (err, r) {

                                        if (err) {
                                            res.send({message: err});
                                            return;
                                        }

                                        res.send({message: ""});

                                    });
                            });
                        });
                });
            });
            break;
    }
});

function getBooks(userId, cb) {
    let col = db.collection('bt_users');
    col.find({userId: userId}, {_id: 0, books: 1}).limit(1).toArray(function (err, docs) {

        if (err) {
            cb({message: err});
            return;
        }

        cb({books: docs[0].books, message: ""});
    });
}

function findBook(title, books) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].title == title)
            return i;
    }
}

module.exports = router;