import React, { Component } from 'react';
import { TraineeClient } from './TraineeClient';


class TraineeContent extends React.Component {
    state = {
        showTable: true, updateId: null
    };
    handleUpdate = (updateTrainee) => {
        console.log('update ' + updateTrainee.id);
        this.props.updateTrainee(updateTrainee);
        this.setState({ showTable: true });
    };
    handleRowClick = (id) => {
        console.log('pressed ' + id);
        this.setState({ showTable: false, updateId: id });
    };
    handleDiscard = () => {
        console.log('discard');
        this.setState({ showTable: true });
    };
    handleDelete = (id) => {
        console.log('delete ' + id);
        this.setState({ showTable: true });
        this.props.deleteTrainee(id);
    };
    render() {
        if (this.state.traineeId === null) {
            var trainee = {};
        } else {
            var trainee = this.props.trainees.find((trainee) => trainee.id === this.state.updateId);
        }
        if (this.state.showTable === true) {
            return (

                <TraineeTable
                    trainees={this.props.trainees}
                    hadleRowClick={this.handleRowClick} />
            );
        } else {
            return (
                <TraineeForm
                    trainee={trainee}
                    onDiscardTrainee={this.handleDiscard}
                    onSaveTrainee={this.handleUpdate}
                    onDeleteTrainee={this.handleDelete}
                    add={false}
                />
            );
        }

    }
}

class TraineeTable extends React.Component {
    handleRowClick = (id) => {
        console.log(id);
        this.props.hadleRowClick(id);
    };
    render() {
        var trainees = this.props.trainees;
        var trainees = this.props.trainees.map((trainee) => {
            return (<TraineeRow
                trainee={trainee}
                rowClicked={this.handleRowClick}
            />);
        });
        console.log(trainees);
        return (
            <table className='ui selectable celled unstackable table'>
                <thead>
                    <tr>
                        <th className='left aligned'>Id</th>
                        <th>Firs Name</th>
                        <th>Last Name</th>
                        <th>Gender</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Age</th>
                        <th>License</th>
                        <th>School Name</th>
                        <th>Teacher Name</th>
                    </tr>
                </thead>
                <tbody>
                    {trainees}
                </tbody>
            </table>
        );
    }
}

class TraineeRow extends React.Component {
    handleClick = () => {
        this.props.rowClicked(this.props.trainee.id)
    };
    render() {
        var trainee = this.props.trainee;
        console.log(trainee);
        return (
            <tr onClick={this.handleClick} >
                <td className='left aligned'>{trainee.id}</td>
                <td>{trainee.firstName}</td>
                <td>{trainee.lastName}</td>
                <td>{trainee.gender}</td>
                <td>{trainee.phoneNumber}</td>
                <td><a href={"mailto:" + trainee.email}>{trainee.email}</a></td>
                <td>{trainee.address}</td>
                <td>{(new Date(Date.now())).getFullYear() - trainee.birthDate.getFullYear()}</td>
                <td>{trainee.license.map((license) => license.license).join(' ')}</td>
                <td>{trainee.schoolName}</td>
                <td>{trainee.teacherName}</td>

            </tr>);
    }
}

class TraineeForm extends React.Component {
    state = {
        id: this.props.trainee.id || '',
        firstName: this.props.trainee.firstName || '',
        lastName: this.props.trainee.lastName || '',
        gender: this.props.trainee.gender,
        phoneNumber: this.props.trainee.phoneNumber || '',
        email: this.props.trainee.email || '',
        address: this.props.trainee.address || '',
        birthDate: {
            year: this.props.trainee.birthDate.getFullYear(),
            month: this.props.trainee.birthDate.getMonth(),
            day: this.props.trainee.birthDate.getDate()
        },
        license: this.props.trainee.license||[],
        teacherName: this.props.trainee.teacherName || '',
        schoolName: this.props.trainee.schoolName || '',
        validation: { message: { isVisible: false, Header: "", body: "" } },
        error: { id: '', firsName: '', lastName: '' },
        loadingDelete: "ui red button",
        loadingUpdate: "ui primary button"

    };
    handleChange = (e) => {
        var update = {};
        if (e.target.name === "date-year") {
            update["birthDate"] = { year: parseInt(e.target.value), month: this.state.birthDate.month, day: this.state.birthDate.day };
        } else if (e.target.name === "date-month") {
            update["birthDate"] = { year: this.state.birthDate.year, month: parseInt(e.target.value), day: this.state.birthDate.day };
        } else if (e.target.name === "date-day") {
            update["birthDate"] = { year: this.state.birthDate.year, month: this.state.birthDate.month, day: parseInt(e.target.value) };
        } else if (e.target.name === "phoneNumber") {
            update["phoneNumber"] = (isNaN(e.target.value)) ? this.state.phoneNumber : e.target.value;
        } else {
            update[e.target.name] = e.target.value;
        }
        this.setState(update);
    };

    handleSave = () => {
        var data = this.state;
        var errorMessage = [];
        data.error.firsName = "";
        data.error.lastName = "";
        data.error.id = "";

        if (data.firstName === "") {
            errorMessage.push("Please Enter Your First Name.");
            data.error.firsName = " error";
        }
        if (data.lastName === "") {
            errorMessage.push("Please Enter Your Last Name.");
            data.error.lastName = " error";
        }
        if (data.id === "") {
            errorMessage.push("Please Enter Your Id.");
            data.error.id = " error";
        } else if (!checkId(parseInt(data.id))) {
            errorMessage.push("Please Enter a Valid Id.");
            data.error.id = " error";
        }
        if (errorMessage.length == 0) {
            this.state.birthDate = new Date(this.state.birthDate.year, this.state.birthDate.month, this.state.birthDate.day);
            this.state['emailAddress'] = this.state['email'];
            if (this.state['gender'] == 'Male') {
                this.state['gender'] = 0;
            } else if (this.state['gender'] == 'Female') {
                this.state['gender'] = 1;
            } else if (this.state['gender'] == 'Other') {
                this.state['gender'] = 2;
            } else {
                this.state['gender'] = 0;
            }
            this.state['licenseTypeLearning'] = this.state['license'];
            this.state['licenseTypeLearning'] = this.state['licenseTypeLearning'].map((license) => {
                license['license'] = getLicense(license['license']);
                if (license['gearType'] === 'Auto') {
                    license['gearType'] = 0;
                } else {
                    license['gearType'] = 1;
                }
                return license;
            });
            this.setState({ loadingUpdate: "ui primary loading button" });
            if (this.props.add) {
                TraineeClient.createTrainees(this.state, this.handleSaveToServer);
            } else {
                TraineeClient.updateTrainees(this.state, this.handleSaveToServer);
            }
        } else {
            data.validation.message.body = errorMessage.map((msg) => {
                return <li>{msg}</li>;
            });
            data.validation.message.Header = "Invalid Data."
            data.validation.message.isVisible = true;
            this.setState(data);
        }
    };

    handleSaveToServer = (message) => {
        console.log(message);
        if (message === "OK") {
            this.props.onSaveTrainee(this.state);
        } else {
            this.setState({ loadingUpdate: "ui primary button" });
            var data = this.state;
            data.validation.message.body = (<li>{message}</li>);
            data.validation.message.Header = "Tester Error."
            data.validation.message.isVisible = true;
            this.setState(data);
        }
    }

    handleDeleteToServer = (message) => {
        if (message === "OK") {
            this.props.onDeleteTrainee(this.state.id);
        } else {
            this.setState({ loadingDelete: "ui red button" });
            var data = this.state;
            data.validation.message.body = (<li>{message}</li>);
            data.validation.message.Header = "Tester Error."
            data.validation.message.isVisible = true;
            this.setState(data);
        }
    };

    handleDiscard = () => {
        this.props.onDiscardTrainee();
    };

    handleDelete = () => {
        this.setState({ loadingDelete: "ui red loading button" });
        TraineeClient.deleteTrainees(this.state.id, this.handleDeleteToServer);
    };

    handleChangeLisence = (updated) => {
        this.setState({ license: updated });
    };

    render() {
        var trainee = this.props.trainee;
        const status = trainee.id ? "Edit" : "New";
        const button = trainee.id ? "Update" : "Save";
        const disabled = trainee.id ? " disabled" : "";
        const deleteButton = trainee.id ? (
            <button className={this.state.loadingDelete} onClick={this.handleDelete}>
                Delete Trainee
                </button>) : "";

        if (this.state.validation.message.isVisible) {
            var message = (<div className="ui error message">
                <div className="header">{this.state.validation.message.Header}</div>
                <ul className='list'>{this.state.validation.message.body}</ul>
            </div>);
        } else {
            message = "";
        }
        return (
            <div className="ui raised very padded text container segment">
                <h2 className="ui header">{status + " Trainee"}</h2>

                <form className='ui form'>
                    <h4 className="ui dividing header">Personal Information</h4>
                    <div className='field'>
                        <label>Name</label>
                        <div className='two required fields'>
                            <div className={'required field' + this.state.error.firsName}>
                                <input type="text" onChange={this.handleChange} value={this.state.firstName} name="firstName" placeholder="First Name">
                                </input>
                            </div>
                            <div className={'required field' + this.state.error.lastName}>
                                <input type="text" onChange={this.handleChange} value={this.state.lastName} name="lastName" placeholder="Last Name">
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className='field'>
                        <div className='three fields'>
                            <div className={'required field' + this.state.error.id + disabled}>
                                <label>Id</label>
                                <input type="text" value={this.state.id} onChange={this.handleChange} name="id" placeholder="000000000">
                                </input>
                            </div>
                            <div className='field'>
                                <label>Gender</label>
                                <select className="ui fluid search dropdown" onChange={this.handleChange} value={this.state.gender} name="gender">
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className='field'>
                                <label>Phone Number</label>
                                <input type="text" value={this.state.phoneNumber} onChange={this.handleChange} name="phoneNumber" placeholder="0500000000">
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className='field'>
                        <div className='two fields'>
                            <div className='field'>
                                <label>Address</label>
                                <input type="text" value={this.state.address} onChange={this.handleChange} name="address" placeholder="Address">
                                </input>
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <input type="email" value={this.state.email} onChange={this.handleChange} name="email" placeholder="example@domail.com">
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className='field'>
                        <label>Birth Date</label>
                        <div className='three fields'>
                            <div className='field'>
                                <label>Year</label>
                                <input type="text" value={this.state.birthDate.year} onChange={this.handleChange} name="date-year" placeholder={(new Date(Date.now())).getFullYear() - 40}>
                                </input>
                            </div>
                            <div className="field">
                                <label>Month</label>
                                <select className="ui fluid search dropdown" value={this.state.birthDate.month} onChange={this.handleChange} name="date-month">
                                    <option value="0">January</option>
                                    <option value="1">February</option>
                                    <option value="2">March</option>
                                    <option value="3">April</option>
                                    <option value="4">May</option>
                                    <option value="5">June</option>
                                    <option value="6">July</option>
                                    <option value="7">August</option>
                                    <option value="8">September</option>
                                    <option value="9">October</option>
                                    <option value="10">November</option>
                                    <option value="11">December</option>
                                </select>
                            </div>
                            <div className="field">
                                <label>Day</label>
                                <input type="text" value={this.state.birthDate.day} onChange={this.handleChange} name="date-day" placeholder="1">
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className='field'>
                        <div className='two fields'>
                            <div className="field">
                                <label>School Name</label>
                                <input type="text" value={this.state.schoolName} onChange={this.handleChange} name="schoolName" placeholder="">
                                </input>
                            </div>
                            <div className='field'>
                                <label>Teacher Name</label>
                                <input type="text" value={this.state.teacherName} onChange={this.handleChange} name="teacherName" placeholder="">
                                </input>
                            </div>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className='field'>
                            <label>Lisence Learning</label>
                            <LisenceTable
                                license={this.state.license}
                                handleChangeLisence={this.handleChangeLisence}/>
                        </div>
                    </div>
                </form>
                {message}
                <div className="ui segment">
                    <button className={this.state.loadingUpdate} onClick={this.handleSave} >
                        {button}
                    </button>
                    <button className="ui button" onClick={this.handleDiscard}>
                        Discard
                </button>
                    {deleteButton}
                </div>
            </div>
        );
    }
}

class LisenceTable extends React.Component {
    state = { license: this.props.license };
    handleChange = (lisence) => {
        if (lisence.enabled) {
            var size = this.state.license.length;
            var lisences = this.state.license.map((lis) => {
                if (lis.license === lisence.license) {
                    return lisence;
                } else {
                    return lis;
                }
            });
            var licenseTag = lisences.map((item) => item.license);
            if (!licenseTag.includes(lisence.license)) {
                lisences = lisences.concat(lisence);
            }
        } else {
            var lisences = this.state.license.filter((item) => {
                return item.license !== lisence.license;
            });
        }
        console.log(lisences.length);
        this.props.handleChangeLisence(lisences);
        this.setState({ license: lisences });
    };
    render() {
        var propLicense = this.props.license;
        var lisence = ['A', 'A1', 'A2', 'B', 'C', 'C1', 'D', 'D1', 'D2', 'D3', 'E', '1'].map((lis) => {
            var reLisence = propLicense.filter(
                (item) => {
                    return item.license === lis
                });
            if (reLisence.length === 1) {
                reLisence = reLisence[0];
                return (
                    <LicenseRow
                        enabled={true}
                        readyForTest={reLisence.readyForTest}
                        license={lis}
                        numberOfLessons={reLisence.numberOfLessons}
                        gearType={reLisence.gearType}
                        handleChange={this.handleChange}
                    />);
            }
            else {
                return (
                    < LicenseRow
                        enabled={false}
                        readyForTest={false}
                        license={lis}
                        numberOfLessons={0}
                        gearType={'Manual'}
                        handleChange={this.handleChange}
/>);
            }
        });
        return (
            <table className='ui celled unstackable table'>
                <thead>
                    <tr>
                        <th className='left aligned'>Is Leaning</th>
                        <th>Lisence Type</th>
                        <th>Car Gear Type</th>
                        <th>Num Of Lessons</th>
                        <th>Ready for Test</th>
                    </tr>
                </thead>
                <tbody>
                    {lisence}
                </tbody>
            </table>
        );
    }
}

class LicenseRow extends React.Component {
    state = {
        enabled: this.props.enabled,
        license: this.props.license,
        gearType: this.props.gearType,
        numberOfLessons: this.props.numberOfLessons,
        readyForTest: this.props.readyForTest,
    }

    handleChange = (e) => {
        var update = this.state;
        if (e.target.name === 'gearType') {
            update[e.target.name] = e.target.value;
            this.setState(update);
        }else if (isNaN(e.target.value)) {
            update[e.target.name] = '0';
            this.setState(update);
        } else if (e.target.name !== 'numberOfLessons' || (!isNaN(e.target.value) && parseInt(e.target.value) >= 0)) {
            update[e.target.name] = e.target.value;
            this.setState(update);
        }
        this.props.handleChange(update);
    };

    handleEnable = (e) => {
        var val = { enabled: !this.state.enabled };
        this.setState(val);
        var update = this.state;
        update["enabled"] = !this.state.enabled;
        this.props.handleChange(update);
    };

    render() {
        if (this.props.readyForTest) {
            var icon = (<i className='green big check icon'></i>);
        } else {
            var icon = (<i className='red big close icon'></i>);
        }
        const disabled = this.state.enabled ? "" : " disabled";


        return (
            <tr>
                <td className='left aligned'>
                    <div className="ui test toggle checkbox">
                        <input type="checkbox" checked={this.state.enabled} onChange={this.handleEnable} />
                        <label> </label>
                    </div>
                </td>
                <td>{this.props.license}</td>
                <td>
                    <select multiple="" value={this.state.gearType} name="gearType" onChange={this.handleChange} className={"ui dropdown" + disabled} >
                        <option value="Auto">Auto</option>
                        <option value="Manual">Manual</option>
                    </select>
                </td>
                <td>
                    <div className={"six wide field" + disabled} >
                        <input type="text" value={this.state.numberOfLessons} onChange={this.handleChange} name="numberOfLessons" placeholder="">
                        </input>
                    </div>
                </td>
                <td>{icon}</td>
            </tr>
        );
    }
}

function getLicense(data) {
    if (data === "B") {
        return 0;
    } else if (data === "A2") {
        return 1;
    } else if (data === "A1") {
        return 2;
    } else if (data === "A") {
        return 3;
    } else if (data === "C1") {
        return 4;
    } else if (data === "C") {
        return 5;
    } else if (data === "D") {
        return 6;
    } else if (data === "D1") {
        return 7;
    } else if (data === "D2") {
        return 8;
    } else if (data === "D3") {
        return 9;
    } else if (data === "E") {
        return 10;
    } else if (data === "1") {
        return 11;
    }
}

function checkId(id) {
    if (id == 0) return false;
    var idArr = [0, 0, 0, 0, 0, 0, 0, 0];

    //put the Id in an arr
    for (var i = 8; i >= 0; i--) {
        idArr[i] = id % 10;
        id = parseInt(id / 10);
    }

    //multiply the odd digits and add one
    for (var i = 0; i < 9; i++) idArr[i] *= i % 2 + 1;

    //sum the digits of the numbers
    for (var i = 0; i < 9; i++) idArr[i] = parseInt(idArr[i] / 10) + idArr[i] % 10;

    //Sum all the numbers
    var sum = 0;
    for (var i = 0; i < 9; i++) sum += idArr[i];


    return sum % 10 == 0;
}
export { TraineeContent, TraineeForm }