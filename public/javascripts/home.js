import React from 'react';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import getBaseUrl from "./getBaseUrl";
import BookRow from "./home/bookRow";

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.getClubBooksCB = this.getClubBooksCB.bind(this);
        this.onTradeclick = this.onTradeclick.bind(this);
        this.onBookCellClick = this.onBookCellClick.bind(this);
        this.onTradeclickCB = this.onTradeclickCB.bind(this);
        this.createTrade = this.createTrade.bind(this);
        this.createTradeCB = this.createTradeCB.bind(this);

        let httpRequest, bookToTrade;
        this.getBooksURL = getBaseUrl() + "clubBooks";
        this.getMyBooksURL = getBaseUrl() + "books";
        this.tradeURL = getBaseUrl() + "trade";
        this.state = {books: []};
        this.getClubBooks();
    }

    getClubBooks(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.getClubBooksCB;
        this.httpRequest.open("POST", this.getBooksURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let userId = localStorage.getItem("loggedIn") ? localStorage.getItem("userId") : "";
        let getReq = {userId: userId};
        this.httpRequest.send(JSON.stringify(getReq));

    }

    getClubBooksCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        this.setState({books: resp.books});
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Get Books Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onTradeclick(e){
        this.bookToTrade = this.state.books[e.target.value];
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onTradeclickCB;
        this.httpRequest.open("POST", this.getMyBooksURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let userId = localStorage.getItem("userId");
        let getReq = {userId: userId};
        this.httpRequest.send(JSON.stringify(getReq));
    }

    onTradeclickCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        this.completeTrade(resp.books);
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Get Books Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    completeTrade(books) {
        this.myBooks = books;
        let responses = [{
            text: 'Choose one...',
            value: ''
        }];

        for (let i = 0; i < books.length; i++) {
            responses.push({text: books[i].title, value: i});
        }

        bootbox.prompt({
            title: "What book would you like to trade?",
            inputType: 'select',
            inputOptions: responses,
            callback: this.createTrade
        });
    }

    createTrade(result) {
        if (result != null && result != '') {
            this.httpRequest = new XMLHttpRequest();
            this.httpRequest.onreadystatechange = this.createTradeCB;
            this.httpRequest.open("POST", this.tradeURL);
            this.httpRequest.setRequestHeader("Content-Type", "application/json");
            let userId = localStorage.getItem("userId");
            let getReq = {
                userId: userId,
                bookToTrade: this.bookToTrade,
                bookForTrade: this.myBooks[result],
                op: "create"
            };
            this.httpRequest.send(JSON.stringify(getReq));
        }
    }

    createTradeCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        bootbox.alert("Trade request created");
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Trade Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onBookCellClick(e){
        if(e.target.id == -1 ) return;

        bootbox.alert(this.state.books[e.target.id].description);
    }

    render() {
        if(this.state.books.length == 0)
            return null;

        let rows = [];

        for(let i = 0, key = 0; i < this.state.books.length; i += 3, key++)
            rows.push( <BookRow books={this.state.books} i={i} key={key}
                                onTradeclick={this.onTradeclick}
                                onBookCellClick={this.onBookCellClick}/>);

        return (
            <div>
                {rows}
            </div>
        );
    }
}