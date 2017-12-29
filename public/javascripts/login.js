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

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.onFormChange = this.onFormChange.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.alertContents = this.alertContents.bind(this);

        this.registerURL = getBaseUrl() + "login";
        this.httpRequest;

        this.state = {
            userId: "",
            passwd1: ""
        };

    }

    onFormChange(e){
        let ste = this.state;
        ste[e.target.id] = e.target.value;
        this.setState(ste);
    }

    onSubmitClick(e){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContents;
        this.httpRequest.open("POST", this.registerURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        this.httpRequest.send(JSON.stringify(this.state));
    }

    alertContents() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let resp = JSON.parse(this.httpRequest.responseText);

                    if(resp.message == "") {
                        localStorage.setItem("loggedIn", true);
                        localStorage.setItem("userId", this.state.userId);
                        this.setState({
                            userId: "",
                            passwd1: ""
                        });
                        this.props.router.push('/');
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Login Request Failed -- Response Code = " + this.httpRequest.status);
                }
            }
        }
        catch (e) {
            bootbox.alert("Caught Exception: " + e.message);
        }
    }

    render() {
        let userIdClass = this.state.userId != "" ? "has-success" : "has-error";
        let passwd1Class = this.state.passwd1 != "" ? "has-success" : "has-error";

        let submitState = userIdClass == "has-error"  ||
            passwd1Class == "has-error" ?
            "disabled" : "";

        return (
            <div className="container">
                <h1 className="text-center">Login</h1>
                <form className="form-horizontal">
                    <div className={"form-group " +  userIdClass}>
                        <div className="col-sm-2">
                            <label className="control-label" htmlFor="userId">User Id</label>
                        </div>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="userId"
                                   placeholder="Enter User Id"
                                   onChange={this.onFormChange} value={this.state.userId}></input>
                        </div>
                    </div>
                    <div className={"form-group " +  passwd1Class}>
                        <div className="col-sm-2">
                            <label className="control-label" htmlFor="password">Password</label>
                        </div>
                        <div className="col-sm-10">
                            <input  type="password" className="form-control" id="passwd1"
                                    placeholder="Enter Password"
                                    onChange={this.onFormChange} value={this.state.passwd1}></input>
                        </div>
                    </div>
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-primary" disabled={submitState}
                                onClick={this.onSubmitClick}>Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}