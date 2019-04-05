import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import { loadAll } from './userListReducer'

import '../App.css';

import NewUser from './NewUser'

class InputBox extends Component {

    render() {
        return (
         <div className="HW2_2_inputBoxBody">
             <input 
                className="HW2_2_inputBox" 
                type="text" 
                placeholder="Search"
                onChange={(e) => this.props.searchInputAction(e)}
                value={this.props.searchText}
                />

                <button className="HW2_2_addButton" onClick={() => this.props.loadAll()} >
                    All
                </button>
                <Link to="/NewUser">
                    <button className="HW2_2_addButton" >
                    +
                    </button>
                </Link>
           
         </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        loadAll: () => {
            dispatch(loadAll())
        }
    });
}

export default connect( null, mapDispatchToProps )(InputBox);