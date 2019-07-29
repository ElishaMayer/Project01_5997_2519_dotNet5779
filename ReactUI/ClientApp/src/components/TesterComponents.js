import React, { Component } from 'react';

class TesterContent extends React.Component {
    state = {
        showTable: true, updateId: null
    };
    handleUpdate = (updateTester) => {
        console.log('update ' + updateTester.id);
        this.props.updateTester(updateTester);
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
        this.props.deleteTester(id);
        this.setState({ showTable: true });
    };
    render() {
        if (this.state.testerId === null) {
            var tester = {};
        } else {
            var tester = this.props.testers.find((tester) => tester.id === this.state.updateId);
        }
        if (this.state.showTable === true) {
            return (

                <TesterTable
                    testers={this.props.testers}
                    hadleRowClick={this.handleRowClick} />
            );
        } else {
            return (
                <TesterForm
                    tester={tester}
                    onDiscardTester={this.handleDiscard}
                    onSaveTester={this.handleUpdate}
                    onDeleteTester={this.handleDelete}
                />
            );
        }

    }
}

class TesterTable extends React.Component {
    handleRowClick = (id) => {
        console.log(id);
        this.props.hadleRowClick(id);
    };
    render() {
        var testers = this.props.testers.map((tester) => {
            return (<TesterRow
                tester={tester}
                rowClicked={this.handleRowClick}
            />);
        });
        console.log(testers);
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
                        <th>Experience</th>
                        <th>MaxDistance</th>
                        <th>MaxWeekExams</th>
                    </tr>
                </thead>
                <tbody>
                    {testers}
                </tbody>
            </table>
        );
    }
}

class TesterRow extends React.Component {
    handleClick = () => {
        this.props.rowClicked(this.props.tester.id)
    };
    render() {
        var tester = this.props.tester;
        console.log(tester);
        return (
            <tr onClick={this.handleClick} >
                <td className='left aligned'>{tester.id}</td>
                <td>{tester.firstName}</td>
                <td>{tester.lastName}</td>
                <td>{tester.gender}</td>
                <td>{tester.phoneNumber}</td>
                <td><a href={"mailto:" + tester.email}>{tester.email}</a></td>
                <td>{tester.address}</td>
                <td>{(new Date(Date.now())).getFullYear() - tester.birthDate.getFullYear()}</td>
                <td>{tester.license.join(' ')}</td>
                <td>{tester.experience}</td>
                <td>{tester.maxDistance}</td>
                <td>{tester.maxWeekExams}</td>

            </tr>);
    }
}

class TesterForm extends React.Component {
    state = {
        id: this.props.tester.id || '',
        firstName: this.props.tester.firstName || '',
        lastName: this.props.tester.lastName || '',
        gender: this.props.tester.gender,
        phoneNumber: this.props.tester.phoneNumber || '',
        email: this.props.tester.email || '',
        address: this.props.tester.address || '',
        birthDate: {
            year: this.props.tester.birthDate.getFullYear(),
            month: this.props.tester.birthDate.getMonth(),
            day: this.props.tester.birthDate.getDate()
        },
        license: ['A', 'B'],
        experience: this.props.tester.experience || 0,
        maxDistance: this.props.tester.maxDistance || 0,
        maxWeekExams: this.props.tester.maxWeekExams || 0,
        validation: { message: { isVisible: false, Header: "", body: "" } },
        error: { id: '', firsName: '', lastName: '' }

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
        } else if (e.target.name === "maxDistance") {
            update["maxDistance"] = (isNaN(e.target.value)) ? this.state.maxDistance : e.target.value;
        } else if (e.target.name === "maxWeekExams") {
            update["maxWeekExams"] = (isNaN(e.target.value)) ? this.state.maxWeekExams : e.target.value;
        } else if (e.target.name === "experience") {
            update["experience"] = (isNaN(e.target.value)) ? this.state.experience : e.target.value;
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
            delete this.state.validation;
            this.state.birthDate = new Date(this.state.birthDate.year, this.state.birthDate.month, this.state.birthDate.day);
            this.props.onSaveTester(this.state);
        } else {
            data.validation.message.body = errorMessage.map((msg) => {
                return <li>{msg}</li>;
            });
            data.validation.message.Header = "Invalid Data."
            data.validation.message.isVisible = true;
            this.setState(data);
        }
    };

    handleDiscard = () => {
        this.props.onDiscardTester();
    };

    handleDelete = () => {
        this.props.onDeleteTester(this.state.id);
    };

    render() {
        var tester = this.props.tester;
        const status = tester.id ? "Edit" : "New";
        const button = tester.id ? "Update" : "Save";
        const disabled = tester.id ? " disabled" : "";
        const deleteButton = tester.id ? (
            <button className="ui red right button" onClick={this.handleDelete}>
                Delete Tester
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
                <h2 className="ui header">{status + " Tester"}</h2>

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
                        <div className='four fields'>
                            <div className='field'>
                                <label>Licenses</label>
                                <select multiple="" className="ui dropdown">
                                    <option value="0">A</option>
                                    <option value="1">A1</option>
                                    <option value="2">A2</option>
                                    <option value="3">B</option>
                                </select>
                            </div>
                            <div className="field">
                                <label>Max Distance</label>
                                <input type="text" value={this.state.maxDistance} onChange={this.handleChange} name="maxDistance" placeholder="0">
                                </input>
                            </div>
                            <div className='field'>
                                <label>Max Exams Per Week</label>
                                <input type="text" value={this.state.maxWeekExams} onChange={this.handleChange} name="maxWeekExams" placeholder="0">
                                </input>
                            </div>
                            <div className="field">
                                <label>Experience</label>
                                <input type="text" value={this.state.experience} onChange={this.handleChange} name="experience" placeholder="0">
                                </input>
                            </div>
                        </div>
                    </div>

                </form>
                {message}
                <button className="ui primary button" onClick={this.handleSave} >
                    {button}
                </button>
                <button className="ui button" onClick={this.handleDiscard}>
                    Discard
                </button>
                {deleteButton}
            </div>
        );
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
export { TesterContent, TesterForm}