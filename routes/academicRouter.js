const express = require("express");
const Academic = require("../models/academic");
const jwt_decode = require('jwt-decode');
const router = express.Router()


router.route("/HOD/assign_course_instructor")
    .put(async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);

        if (decoded.type === "academic") {
            const h = await Academic.findOne({
                id: decoded.id,
                type: "HOD"
            })

            console.log(h);
            if (h) {
                h.courses.push(req.body.course)
                h.save()
            }
        }
    })
    router.route("/CI/view_assigned_slots")
    .get(async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);

        if (decoded.type === "academic") {
            const h = await Academic.findOne({
                id: decoded.id,
            })

            if (h) {
                    res.send(h.Schedule)
            }
            else{
                res.send('You dont have access to schedule')
            }
        }
    })

module.exports = router
