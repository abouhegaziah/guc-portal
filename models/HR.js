const mongoose = require('mongoose')
const schema = mongoose.Schema
const HRSchema = new schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        default: "123456"
    },
    id: {
        type: String,
        unique: true,
    },
    name: String,
    attendance_records: Array,
    sign_in_out: Array,
    missing_days: {
        type: Number,
        default: 0
    }
    ,
    missing_hours: {
        type: Number,
        default: 0
    },
    extra_hours: {
        type: Number,
        default: 0
    },
    salary: Number,
    office_location: String,
    personalInfo : String,
    day_off: {
        type: String,
        default: "Saturday"
    }
})
module.exports = mongoose.model('HR', HRSchema)
