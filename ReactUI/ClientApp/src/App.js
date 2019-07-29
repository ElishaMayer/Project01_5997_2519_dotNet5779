import React, { Component } from 'react';
import { Route } from 'react-router';
import MainComponent  from './components/MainComponent';
//import { Home } from './components/Home';
//import { FetchData } from './components/FetchData';
//import { Counter } from './components/Counter';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
        <MainComponent/>
    );
  }
}
