const express = require("express");
const academic = require("../models/academic");
const course = require("../models/course");
const jwt_decode = require('jwt-decode');
const requests = require("../models/requests");
const locations = require("../models/locations");
const mongoose = require("mongoose");
const department = require("../models/department");
const router = express.Router()

const auth= async (req,res,next)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "academic") {
        const cur = await academic.findById(decoded.id);
        if(!cur)
        return res.status(403).send("unauthorized access")

        next()
  }
}
const courseAuth= async (req,res,next)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "academic") {
        const cur = await academic.findById(decoded.id);
        if(!cur)
        return res.status(403).send("unauthorized access")


        const courseID= await course.findOne({name:req.body.courseName}, {_id:1})
        console.log(courseID)
        const courseObject= await cur.courses.filter(function(value){
          return courseID.equals(value.courseId)
        })
                if(courseObject[0].position !=="hod")
          return res.status(403).send("unauthorized access")
        next()
  }
}

router.route("/HOD/assign_course_instructor")
    .put(auth,courseAuth,async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);

        const cur = await academic.findById(decoded.id);

            if (cur) {
                const x = await academic.findOne({
                    id: req.body.id
                })
                 const c= await course.findOne({
                         name: req.body.courseName
                 })
                 if(c){
                     c.instructorId.push(x._id)
                     await c.save()
                 }
                 else{
                     console.log("not found")
                     res.send("not found")
                 }
                if(x){
                        x.courses.push({courseId:c._id,
                            position:"instructor"})
               await x.save()
                res.send("Instructor added to the course successfully")
                        
                }
                else{
                    console.log("not found")
                    res.send("not found")
                }
            }
})
.post(async(req,res)=>{
    res.send("tmam ya basha")
})
router.route("/HOD/delete_course_instructor")
    .put(auth,courseAuth,async (req,res)=>{
            const token = req.header('auth-token')
            const decoded = jwt_decode(token);

            const cur =  await academic.findById(decoded.id);
            const l =[]
            const locs=[]
            if (cur) {
                const x = await academic.findOne({
                    id: req.body.id
                })
                 const c= await course.findOne({
                     name: req.body.courseName
            })
            if(c){
                c.schedule=c.schedule.filter(function(value){
                    if(value.instructorId)
                    if(value.instructorId.equals(x._id)){
                        value.instructorId=undefined
                        l.push(value.locationId)
                    }
                    return true
                })
                c.instructorId= c.instructorId.filter(function(value){
                    return !(value.equals(x._id))
                })
                await c.save()


                for(var i=0;i<l.length;i++){
                    var obj=await locations.findById(l[i])
                    locs.push(obj)
                }


                for(var i=0;i<locs.length;i++){
                    locs[i].schedule=locs[i].schedule.filter(function(value){
                        if(value.instructorId)
                        if(value.instructorId.equals(x._id) && value.courseId.equals(c._id))
                            value.instructorId=undefined
                            return true
                    })

                 const filter = { name: locs[i].name };
                 const update = { schedule:  locs[i].schedule};
                 await locations.findOneAndUpdate(filter, update,{
                    new:true
              });
                }

            }
            else{
                console.log("not found")
                res.send("not found")
            }
                if(x){
                x.schedule=x.schedule.filter(function(value){
                    return(!(value.courseId.equals(c._id)))
                })
                x.courses= x.courses.filter(function(value){
                        return (!(value.courseId.equals(c._id)) && value.position ==="instructor")
                })
                await x.save()
            }
            else{
                console.log("not found")
                res.send("not found")
            }
            res.send("instructor removed successfully")
            }
})
 router.route("/HOD/view_staff")
    .post(auth,async(req,res)=>{
           const token = req.header('auth-token')
           const decoded = jwt_decode(token);
      
           const cur =  await academic.findById(decoded.id);

            if(cur){
                const c= await course.findOne({
                    name: req.body.courseName
           })
           if(c){
               console.log("if")
               const ress=c.instructorId.filter(function(){
                   return c.departmentId.equals(cur.departmentId)
               })
               console.log(typeof ress)
              academic.find({_id: {$in: ress} }).then(doc => {
                res.send(doc)
                }).catch((err) => {
                    console.error(err)
                    }) 
           }
           else{
            console.log("else")
            console.log(typeof cur.departmentId)
               academic.find({ departmentId:cur.departmentId}).then(doc => {
                res.send(doc)
                }).catch(err => {
                    console.error(err)
                    }) 
           }
      }
})
 router.route("/HOD/update_course_instructor")
     .put(auth,courseAuth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
        const cur =  await academic.findById(decoded.id);

         if(cur){
            const x = await academic.findOne({
                id: req.body.orgId
            })
            const y = await academic.findOne({
                id: req.body.updId
            })
             const c= await course.findOne({
                     name: req.body.courseName
             })
             if(c){
                 c.instructorId=c.instructorId.filter(function(value){
                            return !(value.equals(x._id))
                    })
                    c.instructorId.push(y._id)
            }
            const loc=new Array()
            x.schedule=x.schedule.filter(function(value){
                if(value.courseId.equals(c._id))
                y.schedule.push(value)
                return(!(value.courseId.equals(c._id)))
            })
            for(var i=0;i<c.schedule.length;i++){
                if(c.schedule[i].instructorId.equals(x._id)){
                    console.log("jsdbfbsdbafbsaludbfubasdkfyasbgkyf")
                    loc.push(c.schedule[i].locationId)
                    c.schedule[i].instructorId=y._id
                }
            }
            await c.save()

            const locs=[]

            for(var i=0;i<loc.length;i++){
                var obj=await locations.findById(loc[i])
                locs.push(obj)
            }

            for(var i=0;i<locs.length;i++){
                locs[i].schedule= locs[i].schedule.filter(function(value){
                    if(value.instructorId.equals(x._id) && value.courseId.equals(c._id))
                         value.instructorId=y._id
                   return true
                })

                const filter = { name: locs[i].name };
                const update = { schedule:  locs[i].schedule};
   
                await locations.findOneAndUpdate(filter, update,{
                   new:true
               });
            }

            if(x){     
            x.courses= x.courses.filter(function(value){
                    return (!(value.courseId.equals(c._id) && value.position ==="instructor"))
            })
            await x.save()
        }
        else{
            console.log("old user not found")
            res.send("old user not found")
        }
        if(y){
                y.courses.push({courseId:c._id,
                position:"instructor"})
        await y.save()
        res.send("update is successfull")
                
        }
        else{
            console.log("new user not found")
            res.send("new user not found")
        }
           
   }
})
router.route("/HOD/view_day_off")  
    .post(auth,async(req,res)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);
    
    const cur =  await academic.findById(decoded.id);

     if(cur){
        const s= await academic.findOne({
            id: req.body.id
   })
   if(s){
    res.send((s.dayOff).toString())
   }
   else{
    academic.find({departmentId: cur.departmentId}, {dayOff:1,name:1, _id:1}).then(doc => {
        res.send(doc)
        }).catch(err => {
            console.error(err)
            }) 
   }
   }
     
}) 
router.route("/HOD/view_requests")
    .post(auth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        
        const cur =  await academic.findById(decoded.id);

         if(cur){
            requests.find({ departmentId:cur.departmentId}).then(doc => {
                res.send(doc)
                }).catch(err => {
                    console.error(err)
                    }) 
           }
})
const numOfNotUndefined = (array)  =>{
    let number = 0 
    for(entry of array ){
        if(entry.instructorId!==undefined)
            number++
    }
    return number
}
router.route("/HOD/view_course_coverage")
    .post(auth,courseAuth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
        const cur =  await academic.findById(decoded.id);

         if(cur){

            let response = [] ;
            for (const entry of cur.courses) {

               const output = await course.findOne({
                   _id : entry.courseId
               })
               if(output){
                   if(output.schedule.length!==0)
                        courseCoverage = (numOfNotUndefined(output.schedule)/ output.schedule.length) * 100
                   else 
                        courseCoverage = 0
                    response.push({"course" : output.name , "coverage" : courseCoverage + " %" })
               }
   
             }
   
              res.send(response)
         }
})
router.route("/HOD/view_course_schedule")
    .post(auth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
        const cur =  await academic.findById(decoded.id);

         if(cur){
            const c= await course.findOne({
                name: req.body.courseName
       })
       if(c){
       if(c.departmentId.equals(cur.departmentId))
       res.send(c.schedule)
       }
         }
})
router.route("/HOD/accept_requests")
    .put(auth,async (req,res,next)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
        const cur =  await academic.findById(decoded.id);

         if(cur){
             const request=await requests.findById(mongoose.Types.ObjectId(req.body._id))
             if(request.status ==="pending"){
       request.status="accepted"
       const sender=await academic.findById(request.senderId);
       sender.notifications.push(request._id)
       await request.save()
       await sender.save()

       if(request.type ==="changeDayOff"){

            const cc=[]

             sender.dayOff=request.newDayOff
             sender.schedule=sender.schedule.filter(function(value){
                 if(value.weekDay === sender.dayOff){
                     cc.push(value.courseId)
                 }
                 return value.weekDay!==sender.dayOff
         })
         const c=[]
         for(var i=0;i<cc.length;i++){
             var obj=await course.findById(cc[i])
             c.push(obj)
         }
         const l=new Array(); 
         for(var i=0;i<c.length;i++){
             c[i].schedule=c[i].schedule.filter(function(value){
                 if(value.instructorId)
                 if(value.instructorId.equals(sender._id) && value.weekDay === sender.dayOff){
                     value.instructorId=undefined
                 l.push(value.locationId)
                 }
                 return true
              })
             const filter = { name: c[i].name };
             const update = { schedule:  c[i].schedule};
             await course.findOneAndUpdate(filter, update,{
                  new:true
              });
         }
         const locs=[]
         for(var i=0;i<l.length;i++){
            var obj=await locations.findById(l[i])
            locs.push(obj)
        }
        console.log(l)
        console.log(locs)
        
         for(var i=0;i<locs.length;i++){
             locs[i].schedule= locs[i].schedule.filter(function(value){
                 if(value.instructorId)
                 if((value.instructorId.equals(sender._id)&& value.weekDay === sender.dayOff))
                        value.instructorId=undefined
                return true
             })
             const filter = { name: locs[i].name };
             const update = { schedule:  locs[i].schedule};

             await locations.findOneAndUpdate(filter, update,{
                new:true
            });
         }
            request.Status="accepted"
            request.save()
            sender.save()
            res.send("changed successfully")
       }
    }
    else{
        res.send("this request is already accepted/rejected")
    }
  }
 })
 router.route("/HOD/reject_requests")
    .put(auth,async(req,res,next)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
        const cur =  await academic.findById(decoded.id);

        if(cur){
            const request=await requests.findById(mongoose.Types.ObjectId(req.body._id))
            if(request.status==="pending"){
      console.log(request)
      request.status="rejected"
      const sender=await academic.findById(request.senderId);
      sender.notifications.push(request._id)
      await request.save()
      await sender.save()
      res.send("request is rejected")
        }
        else{
            res.send("this request is already accepted/rejected")
        }
    }
})
module.exports = router
