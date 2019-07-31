import React, { Component } from 'react';
//import { start } from 'repl';
import { TesterForm, TesterContent } from './TesterComponents';
import { TesterClient } from './TesterClient';
import { TraineeForm, TraineeContent } from './TraineeComponents';

import { MenuBar } from './Menu';

//import { Home } from './components/Home';
//import { FetchData } from './components/FetchData';
//import { Counter } from './components/Counter';

export default class MainComponent extends Component {
    state = {
        testers:
            [],
        trainees:
            [{
                id: 18, firstName: "trainne",
                lastName: "mayer",
                gender: "male",
                phoneNumber: "0530009933",
                email: "elisja@gmail.com",
                address: "Beit Shemesh Hertzel 631",
                birthDate: new Date(1995, 8, 18),
                license: [
                    { numberOfLessons: 5, license: 'A', gearType: 'Auto', readyForTest: false },
                    { numberOfLessons: 30, license: 'B', gearType: 'Manual', readyForTest: true }],
                schoolName: "Gil",
                teacherName:"Meir"
            },
            {
                id: 319185997, firstName: "elisja",
                lastName: "mayer",
                gender: "male",
                phoneNumber: "0530009933",
                email: "elisja@gmail.com",
                address: "Beit Shemesh Hertzel 631",
                birthDate: new Date(1995, 8, 18),
                license: [
                    { numberOfLessons: 5, license: 'C', gearType: 'Auto', readyForTest: false },
                    { numberOfLessons: 30, license: 'D', gearType: 'Manual', readyForTest: true }],
                schoolName: "Gil",
                teacherName: "Meir"
            }],
        addTester: false,
        addTrainee: false,
        content:"Trainees"
    };
    updateTester = (updateTester) => {
        var testers = this.state.testers.map((tester) => {
            if (tester.id === updateTester.id) {
                return updateTester;
            } else {
                return tester;
            }
        });
        this.setState({ testers: testers });
        TesterClient.getTesters(this.handleLoad);

    };
    addTester = (addTester) => {
        this.setState({ testers: this.state.testers.concat(addTester), addTester: false })
    };
    removeTester = (id) => {
        var testers = this.state.testers.filter((tester) => {
            return (tester.id !== id)
        });
        this.setState({ testers: testers })
    };
    addTesterClick = () => {
        this.setState({ addTester: true })
    };
    discardTesterClick = () => {
        this.setState({ addTester: false })
    };

    updateTrainee = (updateTrainee) => {
        var trainees = this.state.trainees.map((trainee) => {
            if (trainee.id === updateTrainee.id) {
                return updateTrainee;
            } else {
                return trainee;
            }
        });
        this.setState({ trainees: trainees });
    };
    addTrainee = (addTrainee) => {
        this.setState({ trainees: this.state.trainees.concat(addTrainee), addTrainee: false });
    };
    removeTrainee = (id) => {
        var trainees = this.state.trainees.filter((trainee) => {
            return (trainee.id !== id)
        });
        this.setState({ trainees: trainees })
    };
    addTraineelick = () => {
        this.setState({ addTrainee: true })
    };
    discardTraineeClick = () => {
        this.setState({ addTrainee: false })
    };
    handleChangeContent = (content) => {
        this.setState({ content: content, addTrainee: false, addTester:false});
    };
    handleLoad = (testers) => {
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
        this.setState({ testers: testers });
    }
    constructor(props) {
        super(props);
        TesterClient.getTesters(this.handleLoad);
    }
    render() {

        if (this.state.addTester) {
            var mainContent = (
                <TesterForm
                    tester={{ birthDate: (new Date(Date.now())) }}
                    onDiscardTester={this.discardTesterClick}
                    onSaveTester={this.addTester}
                    add={true}
                />);
        } else if (this.state.addTrainee) {
            var mainContent = (
                <TraineeForm
                    trainee={{ birthDate: (new Date(Date.now())) }}
                    onDiscardTrainee={this.discardTraineeClick}
                    onSaveTrainee={this.addTrainee}
                />);
        } else{
            var mainContent = (
                <div className="main ui container">
                <h1 className="ui dividing centered header">{this.state.content}</h1>
                <MainContent
                    content={this.state.content}
                    updateTester={this.updateTester}
                    deleteTester={this.removeTester}
                    testers={this.state.testers}
                    updateTrainee={this.updateTrainee}
                    deleteTrainee={this.removeTrainee}
                    trainees={this.state.trainees} />
                    </div>);
        }
        return (
            <div className='ui unstackable items'>
                <MenuBar
                    changeContent={this.handleChangeContent}
                    addTester={this.addTesterClick}
                    addTrainee={this.addTraineelick} />
                {mainContent}
            </div>
        );
    }
}

class MainContent extends React.Component {
    render() {
        if (this.props.content === "Tests") {
            return (
                <TestContent />
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
                    trainees={this.props.trainees}/>
            );
        } else {
            <b>error</b>
        }
    }
}

class TestContent extends React.Component {
    render() {
        return (
            <p>not imp</p>
        );
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

