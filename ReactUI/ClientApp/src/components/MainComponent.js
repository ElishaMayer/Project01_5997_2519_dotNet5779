import React, { Component } from 'react';
//import { start } from 'repl';
import { TesterForm, TesterContent } from './TesterComponents';
import { TraineeForm, TraineeContent } from './TraineeComponents';

import { MenuBar } from './Menu';

//import { Home } from './components/Home';
//import { FetchData } from './components/FetchData';
//import { Counter } from './components/Counter';

export default class MainComponent extends Component {
    state = {
        testers:
            [{
                id: 18, firstName: "elisja",
                lastName: "mayer",
                gender: "male",
                phoneNumber: "0530009933",
                email: "elisja@gmail.com",
                address: "Beit Shemesh Hertzel 631",
                birthDate: new Date(1995, 8, 18),
                license: ['A', 'B'],
                experience: 1,
                maxDistance: 1,
                maxWeekExams: 1
            },
            {
                id: 319185997, firstName: "elisja",
                lastName: "mayer",
                gender: "male",
                phoneNumber: "0530009933",
                email: "elisja@gmail.com",
                address: "Beit Shemesh Hertzel 631",
                birthDate: new Date(1995, 8, 18),
                license: ['A', 'B'],
                experience: 1,
                maxDistance: 1,
                maxWeekExams: 1
            }],
        trainees:
            [{
                id: 18, firstName: "trainne",
                lastName: "mayer",
                gender: "male",
                phoneNumber: "0530009933",
                email: "elisja@gmail.com",
                address: "Beit Shemesh Hertzel 631",
                birthDate: new Date(1995, 8, 18),
                license: ['A', 'B'],
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
                license: ['A', 'B'],
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
    };
    addTester = (addTester) => {
        console.log("add tester");
        this.setState({ testers: this.state.testers.concat(addTester), addTester: false })
    };
    removeTester = (id) => {
        var testers = this.state.testers.filter((tester) => {
            return (tester.id !== id)
        });
        this.setState({ testers: testers })
    };
    addTesterClick = () => {
        console.log('add tester');
        this.setState({ addTester: true })
    };
    discardTesterClick = () => {
        console.log('add tester');
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
        console.log("add trainee");
        this.setState({ trainees: this.state.trainees.concat(addTrainee), addTrainee: false })
    };
    removeTrainee = (id) => {
        var trainees = this.state.trainees.filter((trainee) => {
            return (trainee.id !== id)
        });
        this.setState({ trainees: trainees })
    };
    addTraineelick = () => {
        console.log('add trainee');
        this.setState({ addTrainee: true })
    };
    discardTraineeClick = () => {
        console.log('add trainee');
        this.setState({ addTrainee: false })
    };
    handleChangeContent = (content) => {
        this.setState({ content: content, addTrainee: false, addTester:false});
    };
    render() {
        if (this.state.addTester) {
            var mainContent = (
                <TesterForm
                    tester={{ birthDate: (new Date(Date.now())) }}
                    onDiscardTester={this.discardTesterClick}
                    onSaveTester={this.addTester}
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
                <div class="main ui container">
                <h1 class="ui dividing centered header">{this.state.content}</h1>
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



