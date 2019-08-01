import React from 'react';
import { TesterClient } from './TesterClient';


class TesterContent extends React.Component {
    state = {
        showTable: true, updateId: null
    };
    handleUpdate = (updateTester) => {
        this.props.updateTester(updateTester);
        this.setState({ showTable: true });
    };
    handleRowClick = (id) => {
        this.setState({ showTable: false, updateId: id });
    };
    handleDiscard = () => {
        this.setState({ showTable: true });
    };
    handleDelete = (id) => {
        this.setState({ showTable: true });
        this.props.deleteTester(id);
    };
    render() {
        var tester = {};
        if (this.state.testerId === null) {
            tester = {};
        } else {
            tester = this.props.testers.find((tester) => tester.id === this.state.updateId);
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
                    add={false}
                />
            );
        }

    }
}

class TesterTable extends React.Component {
    handleRowClick = (id) => {
        this.props.hadleRowClick(id);
    };
    render() {
        var testers = this.props.testers.map((tester) => {
            return (<TesterRow
                tester={tester}
                rowClicked={this.handleRowClick}
            />);
        });
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
        license: this.props.tester.license || [],
        experience: this.props.tester.experience || 0,
        maxDistance: this.props.tester.maxDistance || 0,
        maxWeekExams: this.props.tester.maxWeekExams || 0,
        schedule: this.props.tester.schedule || { days: [{ hours: [] }, { hours: [] }, { hours: [] }, { hours: [] }, { hours: [] }]},
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

    handleLisenceChange = (license) => {
        this.setState({ license: license })
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
        if (errorMessage.length === 0) {
            this.state.birthDate = new Date(this.state.birthDate.year, this.state.birthDate.month, this.state.birthDate.day);
            this.state['licenseTypeTeaching'] = this.state['license'];
            this.state['licenseTypeTeaching'] = this.state['licenseTypeTeaching'].map((num) => getLicense(num));
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
            this.setState({ loadingUpdate: "ui primary loading button" });
            if (this.props.add) {
                TesterClient.createTester(this.state, this.handleTesterSavedOnServer);
            } else {
                TesterClient.updateTester(this.state, this.handleTesterSavedOnServer);
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

    handleTesterSavedOnServer = (message) => {
        if (message === "OK") {
            this.props.onSaveTester(this.state);
        } else {
            this.setState({ loadingUpdate: "ui primary button" });
            this.state.birthDate = {
                year: this.state.birthDate.getFullYear(),
                month: this.state.birthDate.getMonth(),
                day: this.state.birthDate.getDate()
            };
            var data = this.state;
            data.validation.message.body = (<li>{message}</li>);
            data.validation.message.Header = "Tester Error."
            data.validation.message.isVisible = true;
            this.setState(data);

        }
    }

    handleTesterDeletedOnServer = (message) => {
        if (message === "OK") {
            this.props.onDeleteTester(this.state.id);
        } else {
            var data = this.state;
            data.validation.message.body = (<li>{message}</li>);
            data.validation.message.Header = "Tester Error."
            data.validation.message.isVisible = true;
            this.setState(data);
            this.setState({ loadingDelete: "ui red button" });
        }
    }

    handleDiscard = () => {
        this.props.onDiscardTester();
    };

    handleDelete = () => {
        this.setState({ loadingDelete: "ui red loading button" });
        TesterClient.deleteTester(this.state.id, this.handleTesterDeletedOnServer);
    };

    scheduleUpdated = (schedule) => {
        this.setState({ schedule: schedule.schedule });
    }

    render() {
        var state = this.state;
        var tester = this.props.tester;
        const status = tester.id ? "Edit" : "New";
        const button = tester.id ? "Update" : "Save";
        const disabled = tester.id ? " disabled" : "";
        const deleteButton = tester.id ? (
            <button className={this.state.loadingDelete} onClick={this.handleDelete}>
                Delete Tester
                </button>) : "";

        if (this.state.validation && this.state.validation.message.isVisible) {
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
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                    <option value="Other">Other</option>
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
                        <div className='three fields'>
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
                    <LicenseCheckBox
                        licenses={this.state.license}
                        licenseChaged={this.handleLisenceChange} />
                    <Schedule
                        schedule={this.state.schedule}
                        scheduleUpdated={this.scheduleUpdated}/>
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

class Schedule extends React.Component {
    state = { schedule: this.props.schedule }

    handleClick = (e) => {
        this.state.schedule.days[parseInt(e.target.id[0])].hours[parseInt(e.target.id[2] + (e.target.id[3] ? e.target.id[3]:''))] =
            !this.state.schedule.days[parseInt(e.target.id[0])].hours[parseInt(e.target.id[2] + (e.target.id[3] ? e.target.id[3] : ''))];
        this.setState(this.state);
        this.props.scheduleUpdated(this.state);
    };
    render() {
        return (
            <div className="ui segment">
            <table className="ui compact celled table">
                <thead>
                    <tr>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Thursday</th>
                        <th>Wensday</th>
                        <th>Thursday</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[9] ? "fluid red ui button" : "fluid ui button"} id="0-9" onClick={this.handleClick} type="button"> 9:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[9] ? "fluid red ui button" : "fluid ui button"} id="1-9" onClick={this.handleClick} type="button"> 9:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[9] ? "fluid red ui button" : "fluid ui button"} id="2-9" onClick={this.handleClick} type="button"> 9:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[9] ? "fluid red ui button" : "fluid ui button"} id="3-9" onClick={this.handleClick} type="button"> 9:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[9] ? "fluid red ui button" : "fluid ui button"} id="4-9" onClick={this.handleClick} type="button"> 9:00</button></th>
                    </tr>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[10] ? "fluid red ui button" : "fluid ui button"} id="0-10" onClick={this.handleClick} type="button"> 10:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[10] ? "fluid red ui button" : "fluid ui button"} id="1-10" onClick={this.handleClick} type="button"> 10:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[10] ? "fluid red ui button" : "fluid ui button"} id="2-10" onClick={this.handleClick} type="button"> 10:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[10] ? "fluid red ui button" : "fluid ui button"} id="3-10" onClick={this.handleClick} type="button"> 10:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[10] ? "fluid red ui button" : "fluid ui button"} id="4-10" onClick={this.handleClick} type="button"> 10:00</button></th>
                    </tr>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[11] ? "fluid red ui button" : "fluid ui button"} id="0-11" onClick={this.handleClick} type="button"> 11:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[11] ? "fluid red ui button" : "fluid ui button"} id="1-11" onClick={this.handleClick} type="button"> 11:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[11] ? "fluid red ui button" : "fluid ui button"} id="2-11" onClick={this.handleClick} type="button"> 11:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[11] ? "fluid red ui button" : "fluid ui button"} id="3-11" onClick={this.handleClick} type="button"> 11:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[11] ? "fluid red ui button" : "fluid ui button"} id="4-11" onClick={this.handleClick} type="button"> 11:00</button></th>
                    </tr>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[12] ? "fluid red ui button" : "fluid ui button"} id="0-12" onClick={this.handleClick} type="button"> 12:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[12] ? "fluid red ui button" : "fluid ui button"} id="1-12" onClick={this.handleClick} type="button"> 12:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[12] ? "fluid red ui button" : "fluid ui button"} id="2-12" onClick={this.handleClick} type="button"> 12:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[12] ? "fluid red ui button" : "fluid ui button"} id="3-12" onClick={this.handleClick} type="button"> 12:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[12] ? "fluid red ui button" : "fluid ui button"} id="4-12" onClick={this.handleClick} type="button"> 12:00</button></th>
                    </tr>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[13] ? "fluid red ui button" : "fluid ui button"} id="0-13" onClick={this.handleClick} type="button"> 13:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[13] ? "fluid red ui button" : "fluid ui button"} id="1-13" onClick={this.handleClick} type="button"> 13:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[13] ? "fluid red ui button" : "fluid ui button"} id="2-13" onClick={this.handleClick} type="button"> 13:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[13] ? "fluid red ui button" : "fluid ui button"} id="3-13" onClick={this.handleClick} type="button"> 13:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[13] ? "fluid red ui button" : "fluid ui button"} id="4-13" onClick={this.handleClick} type="button"> 13:00</button></th>
                    </tr>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[14] ? "fluid red ui button" : "fluid ui button"} id="0-14" onClick={this.handleClick} type="button"> 14:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[14] ? "fluid red ui button" : "fluid ui button"} id="1-14" onClick={this.handleClick} type="button"> 14:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[14] ? "fluid red ui button" : "fluid ui button"} id="2-14" onClick={this.handleClick} type="button"> 14:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[14] ? "fluid red ui button" : "fluid ui button"} id="3-14" onClick={this.handleClick} type="button"> 14:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[14] ? "fluid red ui button" : "fluid ui button"} id="4-14" onClick={this.handleClick} type="button"> 14:00</button></th>
                    </tr>
                    <tr>
                        <th><button className={this.state.schedule.days[0].hours[15] ? "fluid red ui button" : "fluid ui button"} id="0-15" onClick={this.handleClick} type="button"> 15:00</button></th>
                        <th><button className={this.state.schedule.days[1].hours[15] ? "fluid red ui button" : "fluid ui button"} id="1-15" onClick={this.handleClick} type="button"> 15:00</button></th>
                        <th><button className={this.state.schedule.days[2].hours[15] ? "fluid red ui button" : "fluid ui button"} id="2-15" onClick={this.handleClick} type="button"> 15:00</button></th>
                        <th><button className={this.state.schedule.days[3].hours[15] ? "fluid red ui button" : "fluid ui button"} id="3-15" onClick={this.handleClick} type="button"> 15:00</button></th>
                        <th><button className={this.state.schedule.days[4].hours[15] ? "fluid red ui button" : "fluid ui button"} id="4-15" onClick={this.handleClick} type="button"> 15:00</button></th>
                    </tr>
                </tbody>
                </table>
                </div>
        );
    }
}

class LicenseCheckBox extends React.Component {
    state = {
        B: this.props.licenses.includes('B'),
        A: this.props.licenses.includes('A'),
        A1: this.props.licenses.includes('A1'),
        A2: this.props.licenses.includes('A2'),
        C1: this.props.licenses.includes('C1'),
        C: this.props.licenses.includes('C'),
        D: this.props.licenses.includes('D'),
        D1: this.props.licenses.includes('D1'),
        D2: this.props.licenses.includes('D2'),
        D3: this.props.licenses.includes('D3'),
        E: this.props.licenses.includes('E'),
        One: this.props.licenses.includes('1')
    }
    handleChange = (e) => {
        var update = {};
        update[e.target.name] = e.target.checked;
        this.setState(update);
        const license = this.state;
        license[e.target.name] = e.target.checked;
        this.props.licenseChaged(([
            license.A ? 'A' : '',
            license.A1 ? 'A1' : '',
            license.A2 ? 'A2' : '',
            license.B ? 'B' : '',
            license.D ? 'D' : '',
            license.D1 ? 'D1' : '',
            license.D2 ? 'D2' : '',
            license.D3 ? 'D3' : '',
            license.C ? 'C' : '',
            license.C1 ? 'C1' : '',
            license.E ? 'E' : '',
            license.One ? '1' : '']).filter((item) => item !== ''));
    };
    render() {
        return (
            <div className="field">
                <label>Lisences</label>
                <div className="ui horizontal segments">
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='A' checked={this.state.A} onChange={this.handleChange} ></input>
                            <label>A</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='A1' checked={this.state.A1} onChange={this.handleChange} ></input>
                            <label>A1</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='A2' checked={this.state.A2} onChange={this.handleChange} ></input>
                            <label>A2</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='B' checked={this.state.B} onChange={this.handleChange} ></input>
                            <label>B</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='D' checked={this.state.D} onChange={this.handleChange} ></input>
                            <label>D</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='D1' checked={this.state.D1} onChange={this.handleChange} ></input>
                            <label>D1</label>
                        </div>

                    </div>
                </div>

                <div className="ui horizontal segments">
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='E' checked={this.state.E} onChange={this.handleChange} ></input>
                            <label>E</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='One' checked={this.state.One} onChange={this.handleChange} ></input>
                            <label>1</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='D2' checked={this.state.D2} onChange={this.handleChange} ></input>
                            <label>D2</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='D3' checked={this.state.D3} onChange={this.handleChange} ></input>
                            <label>D3</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='C' checked={this.state.C} onChange={this.handleChange} ></input>
                            <label>C</label>
                        </div>
                    </div>
                    <div className="ui segment">
                        <div className="ui checkbox">
                            <input type="checkbox" name='C1' checked={this.state.C1} onChange={this.handleChange} ></input>
                            <label>C1</label>
                        </div>
                    </div>
                </div>
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
export { TesterContent, TesterForm }