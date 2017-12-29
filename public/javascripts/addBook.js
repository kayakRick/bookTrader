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
import CenterCol from "./addBook/centerCol"

export default class AddBook extends React.Component {
    constructor(props) {
        super(props);

        if(!localStorage.getItem("loggedIn"))
            this.props.router.push('/');

        let searchResp = sessionStorage.getItem("searchResp");
        let resp = JSON.parse(searchResp);
        let booksToAdd = [];

        for(let i = 0; i < resp.items.length; i++) {
            let description = "description" in resp.items[i].volumeInfo ?
                resp.items[i].volumeInfo.description : "";

            let image = "imageLinks" in resp.items[i].volumeInfo ?
                resp.items[i].volumeInfo.imageLinks.thumbnail :
                getBaseUrl() + "images/no_cover_thumb.gif";


            booksToAdd.push({
                title: resp.items[i].volumeInfo.title,
                descriptions: description,
                image: image
            });
        }


        this.state={booksToAdd: booksToAdd,
            searchTerm: sessionStorage.getItem("searchTerm")
        };

        this.saveBookCB = this.saveBookCB.bind(this);
        this.onAddBookClick = this.onAddBookClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);

        let httpRequest;
        this.saveBookURL = getBaseUrl() + "saveBook";
    }

    onAddBookClick(e){
        this.saveBook(this.state.booksToAdd[e.target.id]);
    }

    saveBook(book){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.saveBookCB;
        this.httpRequest.open("POST", this.saveBookURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        let saveReq = {userId: localStorage.getItem("userId"),
            book: book};
        this.httpRequest.send(JSON.stringify(saveReq));
    }

    saveBookCB(){
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        bootbox.alert(resp.book.title + " added to your collection");
                        this.onCancelClick();
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Save Book Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    onCancelClick(){
        sessionStorage.removeItem("searchResp");
        sessionStorage.removeItem("searchTerm");
        this.props.router.push('/myBooks');
    }

    render(){
        return (<div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <CenterCol searchTerm={this.state.searchTerm}
                                   onAddBookClick={this.onAddBookClick}
                                   onCancelClick={this.onCancelClick}
                                   books={this.state.booksToAdd}/>
                    </div>
                </div>
            </div>
        )

    }
}