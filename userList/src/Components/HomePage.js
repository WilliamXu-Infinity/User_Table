import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';

import '../App.css';

import InputBox from './InputBox'
import DisplayBox from './DisplayBox'
import NewUser from './NewUser'
import FilterBox from './FilterBox'

class HomePage extends Component {

    render() {
        return (
            <div className="HW2_2_body">
                <InputBox />
                <FilterBox />  
            </div>
        );
    }
}

export default HomePage;

