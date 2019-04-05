//question why event.target.value can only pass string instead of boject? line:116

import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { addUser, changeFlag, addUserFromApi, clearUserInfo, setUserInfo } from './userListReducer';
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import Phone from 'react-phone-number-input';
import Select from 'react-select';

import imgF from './img/default_face2.png';

import '../App.css';

import Node from './InputNode'
import InputBox from './InputBox'

class NewUser extends Component {
    componentDidMount() {
        this.props.changeFlag(true);
        this.props.clearUserInfo();
        console.log(this.props.userInfo);
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
                        <p className="HW2_2_addPage_text">Sex</p>
                        <select className="HW2_2_addPage_inputBox" onChange={(event) => {
                            this.props.setUserInfo({...this.props.userInfo, sex: event.target.value})}} >
                            <option value=""> No </option>
                            <option value="M"> M </option>
                            <option value="F"> F </option>   
                        </select>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Office Phone</p>
                        <Phone
                            className="HW2_2_addPage_phoneInput"
                            placeholder="Enter phone number"
                            value={this.props.userInfo.officePhone}
                                onChange={(phone) => {
                                    this.props.setUserInfo({...this.props.userInfo, officePhone: phone});
                                    console.log(this.props.userInfo);
                                }}/>
                    </div>

                    <div className="HW2_2_addPage_Node">
                        <p className="HW2_2_addPage_text">Cell Phone</p>
                        <Phone
                            className="HW2_2_addPage_phoneInput"
                            placeholder="Enter phone number"
                            value={this.props.userInfo.cellPhone}
                                onChange={(phone) => {
                                    this.props.setUserInfo({...this.props.userInfo, cellPhone: phone});
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
                            {this.props.userList.map((val, key) => {
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
        console.log(JSON.stringify(userInfo))

        this.props.addUserFromApi("/api/user/", userInfo);
        this.props.changeFlag(false);
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
}

const mapStateToProps = state => ({
    flag: state.flag,
    userInfo: state.userInfo,
    userList: state.userList,
});

const mapDispatchToProps = dispatch => {
    return({
        changeFlag: (flag) => {
            dispatch(changeFlag(flag));
        },
        addUserFromApi: (url, userInfo) => {
            dispatch(addUserFromApi(url, userInfo))
        },
        clearUserInfo: () => {
            dispatch(clearUserInfo())
        },
        setUserInfo: (userInfo) => {
            dispatch(setUserInfo(userInfo))
        }

    });
}

export default connect(mapStateToProps, mapDispatchToProps) (NewUser);
