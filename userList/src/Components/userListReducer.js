import axios from 'axios';
import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import defaultFace from './img/default_face2.png';

const initialState = {
    start: 0,
    perPage: 5,
    flag: true,
    updateFlag: false,
    searchText: "",
    pageArray: [1, "next"],
    editUserKey: 0,
    sortFlag: true,
    userInfo: {
        imgFile: "",
        name: "",
        title: "",
        sex: "",
        startDate: "",
        officePhone: "",
        cellPhone: "",
        sms: "",
        email: "",
        managerId: "",
        managerName: "",
        numberOfDirectReports:[]
    },
    managerList:[],
    displayList:[],
    userList:[]
}

export const store = createStore(
    updateReducer,
    initialState,
    applyMiddleware(thunk),
    window.devToolsExtension && window.devToolsExtension()
);

function updateReducer(state, action){
    
    switch (action.type) {
        case 'FETCH_DATA':
            return {...state, userList: action.payload, displayList: action.payload}

        case 'FETCH_ONE_USER':
            return {...state, userInfo: action.payload}

        case 'DISPLAY_ALL':
            return {...state, displayList: state.userList}
        
        case 'LOAD_REPORTS':
            return {...state, displayList: action.payload}
        
        case 'SET_USER_INFO':
            return {...state, userInfo: action.payload}
        
        case 'ADD_MANAGER':
            return {...state, managerList: action.payload}

        case 'UPDATE_PAGE_BUTTON':
            const arr = [];
            for(let i = 1; i < (state.userList.length / 5 + 1); i++){
                arr.push(i);
            }
            arr.push("next");
            if(arr.length >= 3 && arr[0] !== "pre")
                arr.unshift("pre");
            return {...state, pageArray: arr}
        
        case 'CHANGE_FLAG':
            return {...state, flag: action.payload};

        case 'CHANGE_UPDATE_FLAG':
            return {...state, updateFlag: action.payload}

        case 'CLEAR_USER_INFO':
            return {...state, numberOfDirectReports: [],
                userInfo: {
                    imgFile: defaultFace,
                    name: "",
                    title: "",
                    sex: "",
                    startDate: "",
                    officePhone: "",
                    cellPhone: "",
                    sms: "",
                    email: "",
                    managerId: "",
                    managerName: "",
                    numberOfDirectReports:[]
                }}

        case 'CHANGE_PAGE':
            switch (action.payload) {
                case "pre":
                    if(state.start-5 >= 0)
                        return {...state, start: state.start-5};
                    else return state;
                case "next":
                    if(state.start+5 < state.userList.length)
                        return {...state, start: state.start+5};
                    else return state;
                default:
                    return {...state, start: (action.payload-1)*5};
            }
        
       case 'SORT_DATA':
       switch (action.payload) {
            case 0:
                if(state.sortFlag)
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.firstName < b.firstName) return -1;
                        if (a.firstName > b.firstName) return 1;
                        return 0
                    }), sortFlag: false};
                else 
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.firstName < b.firstName) return 1;
                        if (a.firstName > b.firstName) return -1;
                        return 0
                    }), sortFlag: true};
                break;
            case 1:
                if(state.sortFlag)
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.lastName < b.lastName) return -1;
                        if (a.lastName > b.lastName) return 1;
                        return 0
                    }), sortFlag: false};
                else 
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.lastName < b.lastName) return 1;
                        if (a.lastName > b.lastName) return -1;
                        return 0
                    }), sortFlag: true};
                break;
            case 2:
                if(state.sortFlag)
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.title < b.title) return -1;
                        if (a.title > b.title) return 1;
                        return 0
                    }), sortFlag: false};
                else 
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.title < b.title) return 1;
                        if (a.title > b.title) return -1;
                        return 0
                    }), sortFlag: true};
                break;
            case 3:
                if(state.sortFlag)
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.sex < b.sex) return -1;
                        if (a.sex > b.sex) return 1;
                        return 0
                    }), sortFlag: false};
                else 
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.sex < b.sex) return 1;
                        if (a.sex > b.sex) return -1;
                        return 0
                    }), sortFlag: true};
            case 4:
                if(state.sortFlag)
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.age < b.age) return -1;
                        if (a.age > b.age) return 1;
                        return 0
                    }), sortFlag: false};
                else 
                    return {...state, userList: state.userList.sort(function(a, b){
                        if(a.age < b.age) return 1;
                        if (a.age > b.age) return -1;
                        return 0
                    }), sortFlag: true};
            default:
                return state;
        }

        default:
            return state;
    }
}

export function sortUserList(val){
    return {
        type: 'SORT_USERLIST',
        payload: val,
    }
}

export function changeFlag(flag){
    return {
        type: 'CHANGE_FLAG',
        payload: flag
    }
}

export function changeUpdateFlag(flag){
    return {
        type: 'CHANGE_UPDATE_FLAG',
        payload: flag
    }
}

export function changePage(val){
    return {
        type: 'CHANGE_PAGE',
        payload: val,
    }
}

export function updatePageButton(){
    return {
        type: 'UPDATE_PAGE_BUTTON',
    }
}

export function sortData(val){
    return {
        type: 'SORT_DATA',
        payload: val,
    }
}

export function fetchData(data){
    return {
        type: 'FETCH_DATA',
        payload: data,
    }
}

export function fetchOneUser(data){
    return {
        type: 'FETCH_ONE_USER',
        payload: data,
    }
}

export function clearUserInfo(){
    return {
        type: 'CLEAR_USER_INFO'
    }
}

export function setUserInfo(userInfo){
    return {
        type: 'SET_USER_INFO',
        payload: userInfo,
    }
}

export function loadAll(){
    return {
        type: 'DISPLAY_ALL',
    }
}

export function loadReports(reportsList){
    return {
        type: 'LOAD_REPORTS',
        payload: reportsList,
    }
}

export function addToManagerList(managerList){
    return {
        type: 'ADD_MANAGER',
        payload: managerList,
    }
}

export function addUserFromApi(url, userInfo){
    return(dispatch) => {
        userInfo.file 
        axios.post(url, userInfo)
            .then((response) => {
                console.log("User has been added");
                console.log(userInfo);
                dispatch(changeUpdateFlag(true));
            })
            .catch(function (error) {
                console.log(error);
        })
    }
}

export function editUserFromApi(url, userInfo){
    return(dispatch) => {
        console.log(JSON.stringify(userInfo))
        axios.put(url, userInfo)
            .then((repsonse) => {
                console.log("User has been edited");
                dispatch(changeUpdateFlag(true));
            })
            .catch(function (error) {
                console.log(error);
        })
    }
}

export function deleteUserFromApi(url, key){
    return(dispatch) => {
        axios.delete(url)
            .then((response) => {
                console.log(url + "  " + response);
                console.log("User Data Deleted");
                dispatch(changeUpdateFlag(true));
            })
            .catch(function (error) {
                console.log(error);
        })
    }
}

export function fetchDataFromApi(url){
    return(dispatch) => {
        axios.get(url)
            .then((response) => {
                console.log("Data Fatched");
                dispatch(fetchData(response.data));
                dispatch(updatePageButton());
            })
            .catch(function (error) {
                console.log(error);
        });
    }
}

export function fetchOneUserFromApi(url){
    return(dispatch) => {
        axios.get(url)
            .then((response) => {
                console.log("User Data Fatched");
                dispatch(fetchOneUser(response.data));
            })
            .catch(function (error) {
                console.log(error);
        })
    }
}


export default updateReducer;