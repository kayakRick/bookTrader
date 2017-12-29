"use strict";

import React from 'react';

class DisplayBook extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let id = this.props.id;

        return(
            <div>
                <div className="outline">
                    <div className="text-center">
                        <h4>{this.props.books[id].title}</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            <img src={this.props.books[id].image} width="128"/>
                        </div>
                        <div className="col-md-10">
                            {this.props.books[id].descriptions}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="btn-group" role="group" aria-label="...">
                            <button type="button" className="btn btn-danger" id={id}
                                    onClick={this.props.onAddBookClick}>Add Book</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default class CenterCol extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let submitState = this.props.bookSearch == "" ? "disabled" : "";

        if(this.props.books.length == 0)
            return null;

        let displayBooks = [];

        for(let i = 0; i < this.props.books.length; i++){
            displayBooks.push(<DisplayBook key={i}
                                           books={this.props.books}
                                           onAddBookClick={this.props.onAddBookClick}
                                           id={i}/>);
        }

        return (<div>
            <div className="text-center">
                <h4>Books To Add</h4>
                <h5>Search Term: {this.props.searchTerm}</h5>
            </div>
            {displayBooks}
        </div>);
    }
}
