"use strict";

import React from 'react';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import getBaseUrl from "./getBaseUrl";

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onFormChange = this.onFormChange.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.alertContents = this.alertContents.bind(this);

        this.registerURL = getBaseUrl() + "register";
        this.httpRequest;

        this.state = {
            userId: "",
            passwd1: "",
            passwd2: "",
            name: "",
            city: "",
            state: ""
        };
    }

    onFormChange(e){
        let ste = this.state;
        ste[e.target.id] = e.target.value;
        this.setState(ste);
    }

    onSubmitClick(e){

        if(this.state.passwd1 != this.state.passwd2){
            bootbox.alert("Password and confirm password do not match");
            return;
        }

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
                            passwd1: "",
                            passwd2: "",
                            name: "",
                            city: "",
                            state: ""
                        });
                        this.props.router.push('/');
                    }else{
                        bootbox.alert(resp.message);
                    }
                }else {
                    bootbox.alert("Register Request Failed -- Response Code = " + this.httpRequest.status);
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
        let passwd2Class = this.state.passwd2 != "" ? "has-success" : "has-error";
        let nameClass = this.state.name != "" ? "has-success" : "has-error";
        let cityClass = this.state.city != "" ? "has-success" : "has-error";
        let stateClass = this.state.state != "" ? "has-success" : "has-error";


        let submitState = userIdClass == "has-error"  ||
            passwd1Class == "has-error" ||
            passwd2Class == "has-error" ||
            nameClass == "has-error" ||
            cityClass == "has-error" ||
            stateClass == "has-error" ?
            "disabled" : "";

        return (
            <div className="container">
                <h1 className="text-center">Register</h1>
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
                    <div className={"form-group " +  passwd2Class}>
                        <div className="col-sm-2">
                            <label className="control-label" htmlFor="confirm password">Confim Password</label>
                        </div>
                        <div className="col-sm-10">
                            <input  type="password" className="form-control" id="passwd2"
                                    placeholder="Confirm Password"
                                    onChange={this.onFormChange} value={this.state.passwd2}></input>
                        </div>
                    </div>
                    <div className={"form-group " +  nameClass}>
                        <div className="col-sm-2">
                            <label className="control-label" htmlFor="name">Name</label>
                        </div>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="name"
                                   placeholder="Enter Name"
                                   onChange={this.onFormChange} value={this.state.name}></input>
                        </div>
                    </div>
                    <div className={"form-group " +  cityClass}>
                        <div className="col-sm-2">
                            <label className="control-label" htmlFor="city">City</label>
                        </div>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="city"
                                   placeholder="Enter City"
                                   onChange={this.onFormChange} value={this.state.city}></input>
                        </div>
                    </div>
                    <div className={"form-group " +  stateClass}>
                        <div className="col-sm-2">
                            <label className="control-label" htmlFor="state">State</label>
                        </div>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="state"
                                   placeholder="Enter State"
                                   onChange={this.onFormChange} value={this.state.state}></input>
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