"use strict";

import React from 'react';

export default class RightCol extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let userId = localStorage.getItem("userId");
        let trades = this.props.trades;
        let displayTrades = [];

        for (let i = 0; i < trades.length; i++) {
            if (trades[i].reqUser == userId)
                displayTrades.push(<DisplayTrade key={i}
                                                 tradeReq={trades[i]}
                                                 i={i}
                                                 onTradeButtonClick={this.props.onTradeButtonClick}/>)
        }

        return(<div>
            <div className="text-center">
                <h4>My Trade Requests</h4>
            </div>
            {displayTrades}
        </div>);
    }
}

class DisplayTrade extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let tradeStatus;

        switch(this.props.tradeReq.tradeAccepted){
            case null:
                tradeStatus = "Pending Approval";
                break;
            case true:
                tradeStatus = "Approved";
                break;
            case false:
                tradeStatus = "Declined";
                break;
        }

        let completeState = tradeStatus != "Approved" ? "disabled" : "";

        return(
            <div>
                <div className="outline">
                    <p>Trade For: {this.props.tradeReq.bookToTrade.title}</p>
                    <p>Owner: {this.props.tradeReq.bookToTrade.owner}</p>
                    <p>My Book: {this.props.tradeReq.reqBook}</p>
                    <p>Status: {tradeStatus}</p>
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-success" value={"c" + this.props.i}
                                disabled={completeState}
                                onClick={this.props.onTradeButtonClick}>Complete Trade</button>
                        <button type="button" className="btn btn-danger" value={"r" + this.props.i}
                                onClick={this.props.onTradeButtonClick}>Delete Trade</button>
                    </div>
                </div>
            </div>
        )
    }
}
