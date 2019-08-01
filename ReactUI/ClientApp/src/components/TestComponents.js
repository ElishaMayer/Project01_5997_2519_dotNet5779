import React, { Component } from 'react';
import { TestClient } from './TestClient';

class TestContent extends React.Component {
    state = {
        content: 0, updateId: null
    };
    handleUpdateClick = (id) => {
        this.setState({ content: 3, updateId: id });
    };
    handleUpdate = () => {
        this.props.updateTest();
        this.setState({ content: 0 });
    }
    handleRowClick = (id) => {
        this.setState({ content: 1, updateId: id });
    };
    handleDiscard = () => {
        this.setState({ content: 0 });
    };
    
  
    handleDelete = (id) => {
        this.props.deleteTest();
        this.setState({ content: 0 });
    };
    render() {

        var test = this.props.tests.find((test) => test.id === this.state.updateId);

        if (this.state.content === 0) {
            return (
                <TestTable
                    tests={this.props.tests}
                    hadleRowClick={this.handleRowClick}
                    handleUpdate={this.handleUpdateClick} />
            );
        } else if (this.state.content === 1) {
            return (
                <ShowTest
                    test={test}
                    handleDiscard={this.handleDiscard}
                    handleDelete={this.handleDelete}
                    handleUpdate={this.handleUpdateClick} />
            );
        } else {
            return (
                <UpdateTest
                    test={test}
                    handleDiscard={this.handleDiscard}
                    handleUpdate={this.handleUpdate}
            />);
        }

    }
}
class UpdateTest extends React.Component {
    state = {
        criteria: [
            { id: '1', type: "Kept Distance", pass: false },
            { id: '2', type: "Parking", pass: false },
            { id: '3', type: "Reverse Parking", pass: false },
            { id: '4', type: "Check Mirrors", pass: false },
            { id: '5', type: "Used Signal", pass: false },
            { id: '6', type: "kept Right of Presidency", pass: false },
            { id: '7', type: "Stopped at Red", pass: false },
            { id: '8', type: "Stopped At Cross Walk", pass: false },
            { id: '9', type: "Right Turn", pass: false },
            { id: '10', type: "Immediate Stop", pass: false },
            { id: '11', type: "Drove Carfully", pass: false }]
    };
    handleChange = (e) => {
        var criteria = this.state.criteria.map((cri) => {
            if (cri.id === e.target.name) {
                cri.pass = !cri.pass;
                return cri;
            } else {
                return cri;
            }
        });
        this.setState({ criteria: criteria });
    };
    update = () => {
        var test = this.props.test;
        test['criteria'] = this.state.criteria;
        test['licenseType'] = getLicense(test['licenseType']);

        TestClient.updateTests(test, this.hadleUpdated);
    };
    hadleUpdated = () => {
        this.props.handleUpdate();
    }
    render() {
        var criteria = this.state.criteria.map((cri) => {
            return (
                <tr>
                    <td>{cri.type}</td>
                    <td className='left aligned'>
                        <div className="ui test toggle checkbox">
                            <input type="checkbox" name={cri.id} checked={cri.pass} onChange={this.handleChange} />
                            <label> </label>
                        </div>
                    </td>
                </tr>);
        });
        return (

            <div className="ui raised very padded text container segment">
                <h3 className="ui dividing header">Update Test Results</h3>
                <table className='ui celled unstackable table'>
                    <thead>
                        <tr>
                            <th className='left aligned'>Criteria</th>
                            <th>Passed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {criteria}
                    </tbody>
                </table>
                <div className="ui segment">
                    <button className="ui button" onClick={this.props.handleDiscard}>
                        Discard
                </button>
                    <button className="ui red button" onClick={this.update}>
                        Update
                </button>
                </div>
            </div>);
    }
}
class ShowTest extends React.Component {
    state = {loading:""}
    deleteTest = () => {
        TestClient.deleteTests(this.props.test.id, this.handleDeleted)
        this.setState({ loading: " loading" });
    };
    handleUpdate = () => {
        this.props.handleUpdate(this.props.test.id);
    }
    handleDeleted = () => {
        this.props.handleDelete(this.props.test.id);
        this.setState({ loading: "" });
    };

    render() {
        if (this.props.test.passed === true) {
            var icon = (<i className='green big check icon'></i>);
        } else if (this.props.test.passed === false) {
            var icon = (<i className='red big close icon'></i>);
        } else {
            var icon = (<button className="ui button" type="button" onClick={this.handleUpdate}>Update</button>);
        }
        return (
            <div className="ui raised very padded text container segment">
                <p><b>Test Id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{this.props.test.id}</p>
                <p><b>Tester Id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{this.props.test.testerId}</p>
                <p><b>Trainee Id:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{this.props.test.traineeId}</p>
                <p><b>Test Time:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{formattedDate(this.props.test.testTime)}</p>
                <p><b>Test Updated:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{formattedDate(this.props.test.actualTestTime)}</p>
                <p><b>License Type:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{this.props.test.licenseType}</p>
                <p><b>Test Address:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{this.props.test.addressOfBeginningTest}</p>
                <p><b>Test Route:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {getLink(this.props.test.routeUrl)}</p>
                <p><b>Passed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{icon}</p>
                <div className="ui segment">
                    <button className="ui button" onClick={this.props.handleDiscard}>
                        Discard
                </button>
                    <button className={"ui red" + this.state.loading + " button"} onClick={this.deleteTest}>
                        Delete
                </button>
                </div>
            </div>);
    }

}


class TestTable extends React.Component {
    handleRowClick = (id) => {
        this.props.hadleRowClick(id);
    };
    render() {
        var tests = this.props.tests.map((test) => {
            return (<TesterRow
                test={test}
                rowClicked={this.handleRowClick}
                key={test.id}
                handleUpdate={this.props.handleUpdate}
            />);
        });
        return (
            <table className='ui selectable celled unstackable table'>
                <thead>
                    <tr>
                        <th className='left aligned'>Id</th>
                        <th>Tester Id</th>
                        <th>Trainee Id</th>
                        <th>Test Time</th>
                        <th>Test Updated</th>
                        <th>Test Address</th>
                        <th>License Type</th>
                        <th>Route</th>
                        <th>Passed</th>
                    </tr>
                </thead>
                <tbody>
                    {tests}
                </tbody>
            </table>
        );
    }
}

class TesterRow extends React.Component {
    handleClick = () => {
        this.props.rowClicked(this.props.test.id)
    };
    handleUpdate = () => {
        this.props.handleUpdate(this.props.test.id);
    };
    render() {
        var test = this.props.test;
        if (test.passed === true) {
            var icon = (<i className='green big check icon'></i>);
        } else if (test.passed === false) {
            var icon = (<i className='red big close icon'></i>);
        } else {
            var icon = (<button className="ui button" type="button" onClick={this.handleUpdate}>Update</button>);
        }
        return (
            <tr  >
                <td onClick={this.handleClick} className='left aligned'>{test.id}</td>
                <td onClick={this.handleClick}>{test.testerId}</td>
                <td onClick={this.handleClick}>{test.traineeId}</td>
                <td onClick={this.handleClick}>{formattedDate(test.testTime)}</td>
                <td onClick={this.handleClick}>{formattedDate(test.actualTestTime)}</td>
                <td onClick={this.handleClick}>{test.addressOfBeginningTest}</td>
                <td onClick={this.handleClick}>{test.licenseType}</td>
                <td>{getLink(test.routeUrl)}</td>
                <td>{icon}</td>

            </tr>);
    }
}

function formattedDate(d) {
    if (d === null || d === undefined || d.getFullYear() === 1) {
        return '';
    }
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
}

function getLink(url) {
    if (url === "" || url === null || url === undefined) {
        return '';
    } else {
        return (<button className="ui button" type="button"><a href={url} target="_blank">Route</a></button >);
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

export { TestContent }