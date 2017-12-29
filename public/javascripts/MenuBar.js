/*********************************************************************************************************
 * The Menubar Class is responsible for displaying the menu bar at the top of the page. It is called
 * by the app class which passes it properties so it knows what needs to be displayed.
 * The Menubar has no state -- it get's it state infomation via props
 *********************************************************************************************************/

import React from 'react';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

export default class MenuBar extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){

        let menu =[];
        let loginMess;

        if(!localStorage.getItem("loggedIn")){
            menu.push(<li key={1}><Link to="/">Home</Link></li>);
            menu.push(<li key={2}><Link to="/Login">Login</Link></li>);
            menu.push(<li key={3}><Link to="/Register">Register</Link></li>);
            menu.push(<li key={4}><a href="#" onClick={this.props.onAboutClick}>About</a></li>);
            loginMess = "Not Logged In"
        }else{
            menu.push(<li key={1}><Link to="/">Home</Link></li>);
            menu.push(<li key={2}><Link to="/MyBooks">My Books</Link></li>);
            menu.push(<li key={3}><a href="#" onClick={this.props.onLogOffClick}>Log Off</a></li>);
            menu.push(<li key={4}><Link to="/AccountSettings">Account Settings</Link></li>);
            menu.push(<li key={5}><a href="#" onClick={this.props.onAboutClick}>About</a></li>);
            loginMess = "Logged In As " + localStorage.getItem("userId");
        }

        return (<div>
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">{loginMess}</a>
                    </div>

                    <div>
                        <ul className="nav navbar-nav navbar-right">
                            {menu}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>);
    }

}
