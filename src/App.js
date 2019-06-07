import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import Upload from './upload/Upload';
import "./App.css";

class App extends Component {
    render () {
        return (
            <div className="App">
                <div className="Card">
                    <Upload />
                </div>
            </div>
        )
    }
};

export default hot(module)(App);