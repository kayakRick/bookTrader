/********************************************************************************************************
 * This is the main container for the bookTrader app.
 * The App class serves as the parent container for the menu bar and the main part of the page. Most
 * menu bar selections are handled by various child components via the react router but "about" is handled
 * directly.
 ********************************************************************************************************/

"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import MenuBar from './MenuBar';
import Home from './home';
import Login from './login';
import Register from './register';
import AccountSettings from './accountSettings';
import MyBooks from './myBooks';
import AddBook from './addBook';

import getBaseUrl from "./getBaseUrl";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.onAboutClick = this.onAboutClick.bind(this);
        this.onLogOffClick = this.onLogOffClick.bind(this);
    }

    getCookieValue (sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }


    onAboutClick(){
        bootbox.alert('Written by Rick Evans<br>Code is available ' + '' +
            '<a href="https://github.com/kayakRick/bookTrader" target="_blank">Here</a>');
    }

    onLogOffClick(){
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loginName");
        this.props.router.push('/');
    }


    render() {
        return(<div>
            <MenuBar onAboutClick={this.onAboutClick} onLogOffClick={this.onLogOffClick}/>
            {this.props.children}
        </div>);
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="Login" component={Login}/>
            <Route path="Register" component={Register}/>
            <Route path="AccountSettings" component={AccountSettings}/>
            <Route path="MyBooks" component={MyBooks}/>
            <Route path="AddBook" component={AddBook}/>
        </Route>
    </Router>,
    document.getElementById("app"));
