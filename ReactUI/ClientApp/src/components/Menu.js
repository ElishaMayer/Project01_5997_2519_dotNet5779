import React, { Component } from 'react';

class MenuBar extends React.Component {
    changeToTester = () => {
        this.props.changeContent("Testers");
    }
    changeToTrainee = () => {
        this.props.changeContent("Trainees");
    }
    changeToTest = () => {
        this.props.changeContent("Test");
    }
    render() {
        return (
            <div className='ui inverted massive menu'>
                <TraineeMenu
                    changeTo={this.changeToTrainee}
                    addTrainee={this.props.addTrainee}/>
                <TesterMenu
                    changeTo={this.changeToTester}
                    addTester={this.props.addTester} />
                <TestMenu />

            </div>
        );
    }
}

class TesterMenu extends React.Component {
    addTester = () => {
        console.log('add clicked');
        this.props.addTester();
    };
    render() {
        return (
            <div className="ui big simple dropdown item">
                Tester
                    <i className="dropdown icon"></i>
                <div className="menu">
                    <div className="item" onClick={this.addTester}>Add New</div>
                    <div className="item" onClick={this.props.changeTo}>Show All Testers</div>
                    <div className="item">Send Email</div>
                </div>
            </div>
        );
    }
}
class TraineeMenu extends React.Component {
    addTrainee = () => {
        console.log('add clicked');
        this.props.addTrainee();
    };
    render() {
        return (
            <div className="ui big simple dropdown item">
                Trainees
                    <i className="dropdown icon"></i>
                <div className="menu">
                    <div className="item" onClick={this.addTrainee}>Add New</div>
                    <div className="item" onClick={this.props.changeTo}>Show All Trainees</div>
                    <div className="item">Send Email</div>
                </div>
            </div>
        );
    }
}

class TestMenu extends React.Component {
    render() {
        return (
            <div className="ui big simple dropdown item">
                Tests
                    <i className="dropdown icon"></i>
                <div className="menu">
                    <div className="item">Add New</div>
                    <div className="item">Send Email</div>
                </div>
            </div>
        );
    }
}

export { MenuBar}
