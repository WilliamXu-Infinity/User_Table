import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { deleteUserFromApi, changePage, sortData, fetchDataFromApi, fetchOneUserFromApi, changeUpdateFlag, loadReports } from './userListReducer'

import '../App.css';

class FilterBox extends Component {

    componentDidMount() {
        this.props.fetchDataFromApi('/api/user');
    }

    componentDidUpdate() {
        console.log("update happend");
        if(this.props.updateFlag){
            this.props.fetchDataFromApi('/api/user');
            this.props.changeUpdateFlag(false);
        }
    }
    
    render() {
        return (
        <div>
            <table className="HW2t"> 
            <tbody>
                <tr className="HW2tr">
                    <th className="HW2th" onClick={() => this.props.sortData(0)}>Image</th>
                    <th className="HW2th" onClick={() => this.props.sortData(1)}>Name</th>
                    <th className="HW2th" onClick={() => this.props.sortData(2)}>Title</th>
                    <th className="HW2th" onClick={() => this.props.sortData(3)}>Sex</th>
                    <th className="HW2th" onClick={() => this.props.sortData(4)}>Start Date</th>
                    <th className="HW2th" onClick={() => this.props.sortData(5)}>Office Phone</th>
                    <th className="HW2th" onClick={() => this.props.sortData(6)}>Cell Phone</th>
                    <th className="HW2th" onClick={() => this.props.sortData(7)}>SMS</th>
                    <th className="HW2th" onClick={() => this.props.sortData(8)}>Email</th>
                    <th className="HW2th" onClick={() => this.props.sortData(9)}>Manager</th>
                    <th className="HW2th" onClick={() => this.props.sortData(10)}>Direct Reports</th>
                    <th className="HW2th" >Function</th>
                </tr>

                
                {/* {this.props.userList.slice(this.props.start, this.props.start+this.props.perPage).map((val, key) => { */}
                {this.props.displayList.map((val, key) => {
                    return (
                        <tr className="HW2tr" key={key}>
                            <td className="HW2td">
                                <img className="HW2_2_img_display2" src={val.imgFile} />
                            </td>
                            <td className="HW2td">{val.name}</td>
                            <td className="HW2td">{val.title}</td>
                            <td className="HW2td">{val.sex}</td>
                            <td className="HW2td">{val.startDate}</td>
                            <td><a href={"tel:+"+val.officePhone}>{val.officePhone}</a></td>
                            <td><a href={"tel:+"+val.cellPhone}>{val.cellPhone}</a></td>
                            <td className="HW2td">{val.sms}</td>
                            <td className="HW2td">{val.email}</td>
                            <td className="HW2td">{val.managerName}</td>
                            <td className="HW2td">
                                <button className="HW2_2_addButton" onClick={() => this.loadReports(val, this.props.userList)} >
                                    {val.numberOfDirectReports.length}
                                </button>
                            </td>
                            <td className="HW2td">
                                <Link to='/EditUser'>
                                    <button onClick={() => this.props.fetchOneUserFromApi('/api/user/'+val._id)}>Edit</button>
                                </Link>
                                <button onClick={() => this.props.deleteUserFromApi('/api/user/'+val._id, key)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                        )
                    })}

                </tbody>
            </table>

            <div className="HW2_2_pageBox">
                {/* {this.props.pageArray.map((val, key) => {
                    return (
                        <button key={key} onClick={() => this.props.changePage(val)}>
                            {val}
                        </button>
                    )
                })} */}
            </div>
        </div>
        );
    }

    deleteUser(key){
        this.props.deleteUser(key);
        this.props.updatePageButton();
    }

    loadReports(userInfo, userList){
        const reportsList = [];
        for(let i = 0; i < userInfo.numberOfDirectReports.length; i++){
            for(let j = 0; j < userList.length; j++){
                if(userList[j]._id === userInfo.numberOfDirectReports[i])
                    reportsList.push(userList[j]);
            }
        }
        console.log(JSON.stringify(reportsList));
        this.props.loadReports(reportsList);
    }
}

const mapStateToProps = state => ({
    userList: state.userList,
    pageArray: state.pageArray,
    start: state.start,
    perPage: state.perPage,
    updateFlag: state.updateFlag,
    displayList: state.displayList
});

const mapDispatchToProps = dispatch => {
    return ({
        deleteUserFromApi: (url, key) => {
            dispatch(deleteUserFromApi(url, key))
        },
        changePage: (val) => {
            dispatch(changePage(val))
        },
        sortData: (val) => {
            dispatch(sortData(val))
        },
        fetchDataFromApi: (url) => {
            dispatch(fetchDataFromApi(url))
        },
        fetchOneUserFromApi: (url) => {
            dispatch(fetchOneUserFromApi(url))
        },
        changeUpdateFlag: (flag) => {
            dispatch(changeUpdateFlag(flag))
        },
        loadReports: (reportsList) => {
            dispatch(loadReports(reportsList))
        }
    });
}
  
export default connect(mapStateToProps, mapDispatchToProps)(FilterBox);