import React, { Component } from 'react';
import { TesterForm, TesterContent } from './TesterComponents';
import {  TestContent } from './TestComponents';
import { TesterClient } from './TesterClient';
import { TestClient } from './TestClient';
import { TraineeClient } from './TraineeClient';
import { TraineeForm, TraineeContent } from './TraineeComponents';

import { MenuBar } from './Menu';

export default class MainComponent extends Component {
    state = {
        testers:
            [],
        trainees:
            [],
        tests: [],
        addTester: false,
        addTrainee: false,
        addTest: false,
        content: "Tests",
        loadingTesters: true,
        loadingTrainees: true,
        loadingTests: true

    };

    reloadTesters = () => {
        TesterClient.getTesters(this.handleLoadTesters);
        this.setState({ loadingTesters: true });
    };
    reloadTests = () => {
        TestClient.getTests(this.handleLoadTests);
        this.setState({ loadingTests: true });
    };
    reloadTrainees = () => {
        TraineeClient.getTrainees(this.handleLoadTrainees);
        this.setState({ loadingTrainees: true });
    };

    addTester = () => {
        this.setState({ addTester: false, content: "Testers" });
        this.reloadTesters();
    };

    addTesterClick = () => {
        this.setState({ addTester: true });
    };
    discardTesterClick = () => {
        this.setState({ addTester: false });
    };


    addTrainee = () => {
        this.setState({ addTrainee: false, content: "Trainees" });
        this.reloadTrainees();
    };

    addTraineelick = () => {
        this.setState({ addTrainee: true });
    };
    discardTraineeClick = () => {
        this.setState({ addTrainee: false });
    };

    addTestClick = () => {
        this.setState({ addTest: false });
    };
    handleChangeContent = (content) => {
        this.setState({ content: content, addTrainee: false, addTester: false });
    };
    handleLoadTesters = (testers) => {
        testers = testers.map((tester) => {
            tester['birthDate'] = new Date(tester['birthDate']);
            tester['license'] = tester['licenseTypeTeaching'];
            tester['email'] = tester['emailAddress'];
            if (tester['gender'] == 0) {
                tester['gender'] = 'Male';
            } else if (tester['gender'] == 1) {
                tester['gender'] = 'Female';
            } else if (tester['gender'] == 2) {
                tester['gender'] = 'Other';
            }
            tester['license'] = tester['license'].map((num) => getLicense(num));
            tester['address'] = tester['address']['city'] + ' ' + tester['address']['street'] + ' ' + tester['address']['building'];

            return tester;
        });
        this.setState({ testers: testers, loadingTesters: false });
    }
    handleLoadTrainees = (trainees) => {
        trainees = trainees.map((trainee) => {
            trainee['birthDate'] = new Date(trainee['birthDate']);
            trainee['license'] = trainee['licenseTypeLearning'];
            trainee['email'] = trainee['emailAddress'];
            if (trainee['gender'] == 0) {
                trainee['gender'] = 'Male';
            } else if (trainee['gender'] == 1) {
                trainee['gender'] = 'Female';
            } else if (trainee['gender'] == 2) {
                trainee['gender'] = 'Other';
            }
            trainee['license'] = trainee['license'].map((license) => {
                license['license'] = getLicense(license['license']);
                if (license['gearType'] === 0) {
                    license['gearType'] = 'Auto';
                } else {
                    license['gearType'] = 'Manual';
                }
                return license;
            });
            trainee['address'] = trainee['address']['city'] + ' ' + trainee['address']['street'] + ' ' + trainee['address']['building'];

            return trainee;
        });
        this.setState({ trainees: trainees, loadingTrainees: false });
    }
    handleLoadTests = (tests) => {
        tests = tests.map((test) => {
            test['licenseType'] = getLicense(test['licenseType']);
            test['actualTestTime'] = new Date(test['actualTestTime']);
            test['testTime'] = new Date(test['testTime']);
            test['addressOfBeginningTest'] = test['addressOfBeginningTest']['city'] + ' ' + test['addressOfBeginningTest']['street'] + ' ' + test['addressOfBeginningTest']['building'];
            return test;

        });
        this.setState({ tests: tests, loadingTests: false });
    };
    constructor(props) {
        super(props);
        TesterClient.getTesters(this.handleLoadTesters);
        TestClient.getTests(this.handleLoadTests);
        TraineeClient.getTrainees(this.handleLoadTrainees);


    }
    render() {
        if (this.state.loadingTesters || this.state.loadingTrainees || this.state.loadingTests) {
            var mainContent = (
                <div className='ui unstackable items'>
                    <MenuBar
                        changeContent={this.handleChangeContent}
                        addTester={this.addTesterClick}
                        addTest={this.addTestClick}
                        addTrainee={this.addTraineelick} />
                    <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                    </div>
                </div>
            );
        } else if (this.state.addTester) {
            var mainContent = (
                <div className='ui unstackable items'>
                    <h1 className="ui dividing centered header">Add New Tester</h1>
                    <TesterForm
                        tester={{ birthDate: (new Date(Date.now())) }}
                        onDiscardTester={this.discardTesterClick}
                        onSaveTester={this.addTester}
                        add={true}
                    />
                </div>
            );
        } else if (this.state.addTrainee) {
            var mainContent = (
                <div className='ui unstackable items'>
                    <h1 className="ui dividing centered header">Add New Trainee</h1>
                    <TraineeForm
                        trainee={{ birthDate: (new Date(Date.now())) }}
                        onDiscardTrainee={this.discardTraineeClick}
                        onSaveTrainee={this.addTrainee}
                        add={true}
                    />
                </div>
            );
        } else {
            var mainContent = (
                <div className='ui unstackable items'>
                    <MenuBar
                        changeContent={this.handleChangeContent}
                        addTester={this.addTesterClick}
                        addTrainee={this.addTraineelick}
                        addTest={this.addTestClick}
                    />
                    <div className="main ui container">
                        <h1 className="ui dividing centered header">{this.state.content}</h1>
                        <MainContent
                            content={this.state.content}
                            updateTester={this.reloadTesters}
                            deleteTester={this.reloadTesters}
                            testers={this.state.testers}
                            tests={this.state.tests}
                            updateTrainee={this.reloadTrainees}
                            deleteTrainee={this.reloadTrainees}
                            deleteTest={this.reloadTests}
                            updateTest={this.reloadTests}
                            trainees={this.state.trainees} />
                    </div>
                </div>
            );
        }
        return (

            mainContent

        );
    }
}

class MainContent extends React.Component {
    render() {
        var con = this.props.content;
        if (this.props.content === "Tests") {
            return (
                <TestContent
                    tests={this.props.tests}
                    updateTest={this.props.updateTest}
                    deleteTest={this.props.deleteTest}/>
            );
        } else if (this.props.content === "Testers") {
            return (
                <TesterContent
                    testers={this.props.testers}
                    updateTester={this.props.updateTester}
                    deleteTester={this.props.deleteTester}
                />
            );
        } else if (this.props.content === "Trainees") {
            return (
                <TraineeContent
                    updateTrainee={this.props.updateTrainee}
                    deleteTrainee={this.props.deleteTrainee}
                    trainees={this.props.trainees} />
            );
        } else {
            return (
                <b>error</b>);
        }
    }
}


function getLicense(data) {
    if (data == 0) {
        return "B";
    } else if (data == 1) {
        return "A2";
    } else if (data == 2) {
        return "A1";
    } else if (data == 3) {
        return "A";
    } else if (data == 4) {
        return "C1";
    } else if (data == 5) {
        return "C";
    } else if (data == 6) {
        return "D"
    } else if (data == 7) {
        return "D1";
    } else if (data == 8) {
        return "D2";
    } else if (data == 9) {
        return "D3";
    } else if (data == 10) {
        return "E";
    } else if (data == 11) {
        return "1";
    }
}

