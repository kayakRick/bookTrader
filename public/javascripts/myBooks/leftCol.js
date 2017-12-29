"use strict";

import React from 'react';

export default class LeftCol extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let userId = localStorage.getItem("userId");
        let trades = this.props.trades;
        let displayTrades = [];

        for (let i = 0; i < trades.length; i++) {
            if (trades[i].bookToTrade.owner == userId && trades[i].tradeAccepted == null)
                displayTrades.push(<DisplayTrade key={i}
                                                 tradeReq={trades[i]}
                                                 i={i}
                                                 onDescriptionClick={this.props.onDescriptionClick}
                                                 onTradeButtonClick={this.props.onTradeButtonClick}/>)
        }

        return(<div>
            <div className="text-center">
                <h4>Trades To Approve</h4>
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
        return(
            <div>
                <div className="outline">
                    <p>My Book: {this.props.tradeReq.bookToTrade.title}</p>
                    <p>Trade For: <a href="#" onClick={this.props.onDescriptionClick}
                        title={this.props.tradeReq.reqBook}>
                        {this.props.tradeReq.reqBook}</a></p>
                    <p>Requested By: {this.props.tradeReq.reqUser}</p>
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-success" value={"a" + this.props.i}
                                onClick={this.props.onTradeButtonClick}>Accept Trade</button>
                        <button type="button" className="btn btn-danger" value={"d" + this.props.i}
                                onClick={this.props.onTradeButtonClick}>Decline Trade</button>
                    </div>
                </div>
            </div>
        )
    }
}
