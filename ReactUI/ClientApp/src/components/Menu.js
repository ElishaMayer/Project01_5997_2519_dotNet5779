import React, { Component } from 'react';

class MenuBar extends React.Component {
    changeToTester = () => {
        this.props.changeContent("Testers");
    }
    changeToTrainee = () => {
        this.props.changeContent("Trainees");
    }
    changeToTest = () => {
        this.props.changeContent("Tests");
    }
    render() {
        return (
            <div className='ui inverted massive menu'>
                <TraineeMenu
                    changeTo={this.changeToTrainee}
                    addTrainee={this.props.addTrainee} />
                <TesterMenu
                    changeTo={this.changeToTester}
                    addTester={this.props.addTester} />
                <TestMenu
                    changeTo={this.changeToTest}
                    addTest={this.props.addTest} />
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
                </div>
            </div>
        );
    }
}

class TestMenu extends React.Component {
    addTest = () => {
        console.log('add clicked');
        this.props.addTest();
    };
    render() {
        return (
            <div className="ui big simple dropdown item">
                Test
                    <i className="dropdown icon"></i>
                <div className="menu">
                    <div className="item" onClick={this.addTest}>Add New</div>
                    <div className="item" onClick={this.props.changeTo}>Show All Tests</div>
                </div>
            </div>
        );
    }
}

export { MenuBar }
