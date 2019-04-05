import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { changeFlag, setUserInfo, editUserFromApi, addToManagerList } from './userListReducer';
import imgF from './img/default_face2.png';

import '../App.css';

import Node from './InputNode'
import InputBox from './InputBox'

class NewUser extends Component {

    componentDidMount() {
        this.props.changeFlag(true);
        this.setManagerList(this.props.userInfo, this.props.userList);
    }

    render() {
        if(this.props.flag){
            return (
                <div className="HW2_2_addPage_body">

                    <img className="HW2_2_img_display" src={this.props.userInfo.imgFile} />

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Name</p>
                        <input
                            className="HW2_2_addPage_inputBox"
                            type="text" 
                            value={this.props.userInfo.name}
                            onChange={(event) => {
                                this.props.setUserInfo({...this.props.userInfo, name: event.target.value});
                                console.log(this.props.userInfo);
                            }}/>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Title</p>
                        <input
                            className="HW2_2_addPage_inputBox"
                            type="text" 
                            value={this.props.userInfo.title}
                            onChange={(event) => {
                                this.props.setUserInfo({...this.props.userInfo, title: event.target.value});
                                console.log(this.props.userInfo);
                            }}/>
                    </div> 

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Sex: {this.props.userInfo.sex}</p>
                        <select className="HW2_2_addPage_inputBox" onChange={(event) => {
                            this.props.setUserInfo({...this.props.userInfo, sex: event.target.value})}} >
                            <option value=""> No </option>
                            <option value="M"> M </option>
                            <option value="F"> F </option>   
                        </select>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Office Phone</p>
                        <input
                            className="HW2_2_addPage_inputBox"
                            type="text" 
                            value={this.props.userInfo.officePhone}
                            onChange={(event) => {
                                this.props.setUserInfo({...this.props.userInfo, officePhone: event.target.value});
                                console.log(this.props.userInfo);
                            }}/>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Cell Phone</p>
                        <input
                            className="HW2_2_addPage_inputBox"
                            type="text" 
                            value={this.props.userInfo.cellPhone}
                            onChange={(event) => {
                                this.props.setUserInfo({...this.props.userInfo, cellPhone: event.target.value});
                                console.log(this.props.userInfo);
                            }}/>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">SMS</p>
                        <input
                            className="HW2_2_addPage_inputBox"
                            type="text" 
                            value={this.props.userInfo.sms}
                            onChange={(event) => {
                                this.props.setUserInfo({...this.props.userInfo, sms: event.target.value});
                                console.log(this.props.userInfo);
                            }}/>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Email</p>
                        <input
                            className="HW2_2_addPage_inputBox"
                            type="text" 
                            value={this.props.userInfo.email}
                            onChange={(event) => {
                                this.props.setUserInfo({...this.props.userInfo, email: event.target.value});
                                console.log(this.props.userInfo);
                            }}/>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Manager: {this.props.userInfo.managerName}</p>
                        <select className="HW2_2_addPage_inputBox" onChange={(event) => {
                            if(event.target.value === "")
                                this.props.setUserInfo({...this.props.userInfo, managerId: "", managerName: "" })
                            else 
                                this.props.setUserInfo({...this.props.userInfo, managerId: this.props.userList[event.target.value]._id, managerName: this.props.userList[event.target.value].name })}} >
                            <option value="">No One</option>
                            {this.props.managerList.map((val, key) => {
                                return(
                                    <option key={key} value={key}>{val.name}</option>
                                )
                            })} 
                        </select>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Add Picture</p>
                        <button className="HW2_2_addPage_saveButton" onClick={() => this.setDefaultImg()}>
                        default
                        </button> 
                        <input className="HW2_2_addPage_inputBox" type="file" onChange={event => {

                            this.getBase64(event.target.files[0]).then(base64 => {
                                this.props.setUserInfo({...this.props.userInfo, imgFile: base64}); 
                            })
                        }} />
                    </div>
    
                    <button className="HW2_2_addPage_saveButton" onClick={() => this.saveFunction(this.props.userInfo)}>
                        save
                    </button>        
                </div>
            );
        }
        else {
            return (<Redirect to={{pathname: "/"}}/>)
        }
    }

    saveFunction(userInfo){
        this.props.editUserFromApi("/api/user/"+userInfo._id, userInfo);
        this.props.changeFlag(false);
    }

    findUserName(userId){
        const obj = this.props.userList.find(o => o._id === userId);
        console.log("this is what i found!!!: " + JSON.stringify(obj));
    }

    setDefaultImg() {
        this.props.setUserInfo({...this.props.userInfo, imgFile: imgF});
    }

    getBase64 = file => {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error)
            reader.readAsDataURL(file);
        })
    }

    setManagerList(userInfo, userList) {
        const noList = [];
        this.mapAllReports(noList, userInfo)
        const managerList = [];
        for(let i = 0; i < userList.length; i++){
            if(noList.indexOf(userList[i]._id) === -1)
                managerList.push(userList[i]);
        }
        this.props.addToManagerList(managerList);
    }

    mapAllReports(noList, userInfo){
        if(userInfo.numberOfDirectReports.length === 0)
            return;
        for(let i = 0; i < userInfo.numberOfDirectReports.length; i++){
            noList.push(userInfo.numberOfDirectReports[i]);
            this.mapAllReports(noList, userInfo.numberOfDirectReports[i]);
        }
    }
}

const mapStateToProps = state => ({
    flag: state.flag,
    userInfo: state.userInfo,
    userList: state.userList,
    managerList: state.managerList,
});

const mapDispatchToProps = dispatch => {
    return({
        changeFlag: (flag) => {
            dispatch(changeFlag(flag));
        },
        editUserFromApi: (url, userInfo) => {
            dispatch(editUserFromApi(url, userInfo))
        },
        setUserInfo: (userInfo) => {
            dispatch(setUserInfo(userInfo))
        },
        addToManagerList: (managerList) => {
            dispatch(addToManagerList(managerList))
        }
    });
}

export default connect(mapStateToProps, mapDispatchToProps) (NewUser);
