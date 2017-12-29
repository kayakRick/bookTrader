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
                                    onClick={this.props.onDeleteBookClick}>Delete Book</button>
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
        let displayBooks = [];

        for(let i = 0; i < this.props.books.length; i++){
            displayBooks.push(<DisplayBook key={i}
                                           books={this.props.books}
                                           onDeleteBookClick={this.props.onDeleteBookClick}
                                           id={i}/>);
        }

        return (<div>
            <div className="text-center">
                <h4>My Books</h4>
            </div>
            <div className="text-center">
                <form>
                    <input type="text" size="45" id="bookSearch"
                           placeholder="Search for book to add" onChange={this.props.onFormChange}
                           value={this.props.bookSearch}/>
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-primary" disabled={submitState}
                                onClick={this.props.onSearchClick}>Submit</button>
                    </div>
                </form>
            </div>
            {displayBooks}
        </div>);
    }
}
