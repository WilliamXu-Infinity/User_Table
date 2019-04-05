import React, { Component } from 'react';
import './App.css';

import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import HomePage from './Components/HomePage'
import NewUser from './Components/NewUser'
import EditUser from './Components/EditUser'
import MultiSelectField from './Components/MultiSelectField'


class App extends Component {


  render() {
    return (
      <BrowserRouter>
        <div>
        <Switch>
            <Route exact path="/" render={() => 
              <HomePage />
            }/>

            <Route exact path="/NewUser" render={() =>
              <NewUser />
            }/>

            <Route exact path="/EditUser" render={() =>
              <EditUser />
            }/>
            
        </Switch>
        
        <div className="breakLine"></div>
        </div>
    </BrowserRouter>
    );
  }
}

export default App;
