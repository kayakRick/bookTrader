import React from 'react';

export default class BarRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className="container">
                <div className="row">
                    <BookCell books={this.props.books} i={this.props.i}
                              onBookCellClick={this.props.onBookCellClick}
                              onTradeclick={this.props.onTradeclick}/>
                    <BookCell books={this.props.books} i={this.props.i + 1}
                              onBookCellClick={this.props.onBookCellClick}
                              onTradeclick={this.props.onTradeclick} />
                    <BookCell books={this.props.books} i={this.props.i + 2}
                              onBookCellClick={this.props.onBookCellClick}
                              onTradeclick={this.props.onTradeclick}/>
                </div>
            </div>
        );
    }
}


class BookCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const imgStyle = {
            width: '128px',
            marginBottom: "10px"
        };

        let i = this.props.i;
        let books = this.props.books;

        if (i >= books.length)
            return null;

        return(
            <div className="col-md-4">
                <div className="thumbnail book" onClick={this.props.onBookCellClick} id={i}>
                    <div className="text-center">
                        <h5 id={i}> {books[i].title}</h5>
                    </div>
                    <img src={books[i].image} style={imgStyle} id={i}/>
                    <div className="text-center">
                        <Tradebutton onTradeclick={this.props.onTradeclick} i={i}/>
                    </div>
                </div>
            </div>
        );
    }
}

class Tradebutton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(localStorage.getItem("loggedIn"))
            return(
                <button className="btn btn-primary" type="button" id="-1"
                        value={this.props.i} onClick={this.props.onTradeclick}>Trade</button>
            );
        else
            return null;
    }
}

