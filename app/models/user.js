var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    imgFile: String,
    name: String,
    title: String,
    sex: String,
    startDate: { type: Date, default: Date.now },
    officePhone: Number,
    cellPhone: String,
    sms: String,
    email: String,
    managerId: String,
    managerName: String,
    numberOfDirectReports:[]
});

module.exports = mongoose.model('User', UserSchema);