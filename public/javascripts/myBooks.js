"use strict";

import React from 'react';

import {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link
} from 'react-router';

import getBaseUrl from "./getBaseUrl";
import LeftCol from "./myBooks/leftCol";
import RightCol from "./myBooks/rightCol";
import CenterCol from "./myBooks/centerCol"

export default class MyBooks extends React.Component {
    constructor(props) {
        super(props);

        if(!localStorage.getItem("loggedIn"))
            this.props.router.push('/');

        this.state={books: [],
            bookDesc: new Map(),
            bookSearch: "",
            trades: []
        };
        this.onSearchClickCB = this.onSearchClickCB.bind(this);
        this.getBooksCB = this.getBooksCB.bind(this);
        this.getTradesCB = this.getTradesCB.bind(this);
        this.getClubBooksCB = this.getClubBooksCB.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onSearchFormChange = this.onSearchFormChange.bind(this);
        this.onDeleteBookClick = this.onDeleteBookClick.bind(this);
        this.onDescriptionClick = this.onDescriptionClick.bind(this);
        this.onTradeButtonClick = this.onTradeButtonClick.bind(this);
        this.onTradeButtonClickCB = this.onTradeButtonClickCB.bind(this);
        this.deleteBookCB = this.deleteBookCB.bind(this);

        let httpRequest, httpRequest2, httpRequest3, op;
        this.getBooksURL = getBaseUrl() + "books";
        this.deleteBookURL = getBaseUrl() + "deleteBook";
        this.getTradesURL = getBaseUrl() + "tradesForUser";
        this.getClubBooksURL = getBaseUrl() + "clubBooks";
        this.tradeURL = getBaseUrl() + "trade";
        this.maxResults = 40;
        this.getBooks();
        this.getTrades();
        this.getClubBooks();
    }

    getBooks(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.getBooksCB;
        this.httpRequest.open("POST", this.getBooksURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let userId = localStorage.getItem("loggedIn") ? localStorage.getItem("userId") : "";
        let getReq = {userId: userId};
        this.httpRequest.send(JSON.stringify(getReq));
    }

    getTrades(){
        this.httpRequest2 = new XMLHttpRequest();
        this.httpRequest2.onreadystatechange = this.getTradesCB;
        this.httpRequest2.open("POST", this.getTradesURL);
        this.httpRequest2.setRequestHeader("Content-Type", "application/json");
        let userId = localStorage.getItem("loggedIn") ? localStorage.getItem("userId") : "";
        let getReq = {userId: userId};
        this.httpRequest2.send(JSON.stringify(getReq));
    }

    getBooksCB(){
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

    getTradesCB(){
        try {
            if (this.httpRequest2.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest2.status === 200) {
                    let resp = JSON.parse(this.httpRequest2.responseText);

                    if(resp.message == "") {
                        this.setState({trades: resp.trades})
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Get Trades Request Failed -- Response Code = " + this.httpRequest2.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }
    
    getClubBooks(){
        this.httpRequest3 = new XMLHttpRequest();
        this.httpRequest3.onreadystatechange = this.getClubBooksCB;
        this.httpRequest3.open("POST", this.getClubBooksURL);
        this.httpRequest3.setRequestHeader("Content-Type", "application/json");
        let userId = localStorage.getItem("loggedIn") ? localStorage.getItem("userId") : "";
        let getReq = {userId: userId};
        this.httpRequest3.send(JSON.stringify(getReq));

    }

    getClubBooksCB(){
        try {
            if (this.httpRequest3.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest3.status === 200) {
                    let resp = JSON.parse(this.httpRequest3.responseText);

                    if(resp.message == "") {
                        let books = resp.books;
                        let bookDesc = new Map();

                        for(let i = 0; i < books.length; i++){
                            bookDesc.set(books[i].title, books[i].description);
                        }

                        this.setState({bookDesc: bookDesc});
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Get Club Books Request Failed -- Response Code = " + this.httpRequest3.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onSearchClickCB() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let books = [];
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if (resp.items.length == 0) {
                        bootbox.alert("No matching books found");
                        return;
                    }
                        sessionStorage.setItem("searchResp", this.httpRequest.responseText);
                        sessionStorage.setItem("searchTerm", this.state.bookSearch);
                        this.props.router.push('/addBook');
                    } else {
                        bootbox.alert("Books API Request Failed -- Response Code = " + this.httpRequest.status);
                    }
                }
            }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onSearchClick(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onSearchClickCB;
        this.httpRequest.open("get", "https://www.googleapis.com/books/v1/volumes?q=" +
            this.state.bookSearch + "&maxResults=" + this.maxResults);
        this.httpRequest.send();

    }

    onSearchFormChange(e){
        let ste = this.state;
        ste[e.target.id] = e.target.value;
        this.setState(ste);
    }

    onDeleteBookClick(e){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.deleteBookCB;
        this.httpRequest.open("POST", this.deleteBookURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let deleteReq = {userId: localStorage.getItem("userId"),
            bookNum: e.target.id};
        this.httpRequest.send(JSON.stringify(deleteReq));
    }

    deleteBookCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        let books = this.state.books;
                        let title = books[resp.bookNum].title;
                        let newBooks = [];

                        for(let i = 0; i < books.length; i++){
                            if(i != resp.bookNum)
                                newBooks.push(books[i]);
                        }
                        bootbox.alert(title + " deleted from your collection");
                        this.setState({books: newBooks});
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Delete Book Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onDescriptionClick(e){
        e.preventDefault();
        bootbox.alert(this.state.bookDesc.get(e.target.title));
    }

    onTradeButtonClick(e){
        let tradeAccepted = e.target.value.charAt(0) == "a";
        let tradeNo = e.target.value.substr(1);
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onTradeButtonClickCB;
        this.httpRequest.open("POST", this.tradeURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let userId = localStorage.getItem("userId");

        switch (e.target.value.charAt(0)){
            case "a":
            case "d":
                this.op = "update";
                break;
            case "c":
                this.op = "complete";
                break;
            case "r":
                this.op = "delete";
                break;
        }

        let getReq = {
            userId: userId,
            trade: this.state.trades[tradeNo],
            tradeAccepted: tradeAccepted,
            op: this.op
        };

        this.httpRequest.send(JSON.stringify(getReq));

    }

    onTradeButtonClickCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        this.getTrades();

                        if(this.op == "complete"){
                            this.getBooks();
                            this.getClubBooks();
                        }
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Update trade Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    render(){
        return (<div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <LeftCol trades={this.state.trades}
                                 onDescriptionClick={this.onDescriptionClick}
                                 onTradeButtonClick={this.onTradeButtonClick}/>
                    </div>
                    <div className="col-md-6">
                        <RightCol trades={this.state.trades}
                                  onTradeButtonClick={this.onTradeButtonClick}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <CenterCol bookSearch={this.state.bookSearch}
                                   onSearchClick={this.onSearchClick}
                                   onFormChange={this.onSearchFormChange}
                                   onDeleteBookClick={this.onDeleteBookClick}
                                   books={this.state.books}/>
                    </div>
                </div>
            </div>
        )

    }
}