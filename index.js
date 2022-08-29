"use strict";

const express = require('express');

const app = express();  

app.use(express.json()); 
app.use(express.urlencoded({extended: false}));

class gymClass{
    //This class contains classType,  userList, itingList, startTime, maxCapacity of each class happening in the gym.
    classType;
    userList;
    waitingList;
    startTime;
    maxCapacity;

    constructor(classType, time, maxCapacity){
    this.classType = classType;
        this.userList = new Set();
        this.waitingList = new Set();
        this.startTime = time;
        this.maxCapacity = maxCapacity;
    }

    bookUser(name){
        if(this.userList.has(name)){
            return {
                statusCode: 400, 
                messageTxt: "You are already booked"
            } 
        }
        else if(this.waitingList.has(name)){
            return {
                statusCode: 400, 
                messageTxt: "You are waitlisted already"
            } 
             
        }
        else if(this.userList.size < this.maxCapacity){
            this.userList.add(name)
            return {
                statusCode: 200, 
                messageTxt: "You have been booked"
            }
             
        }
        else{
            this.waitingList.add(name)
            return {
                statusCode: 200, 
                messageTxt: "You have been waitlisted"
            }
            
        }
    }

    cancelUser(name){
        if(this.userList.has(name)){
            //deleting user
            this.userList.delete(name);
        }
        else return false;

        if( (this.userList.size < this.maxCapacity) && (this.waitingList.size > 0) ){
            //trying to add someone from the waitlsit into the userlist.
            let [ waitingUser ] = this.waitingList; //getting the first element
            this.waitingList.delete(waitingUser);
            this.userList.add(waitingUser);
        }

        return true;
    }
}

var classMap = new Map();

let timePlus30 = new Date();
timePlus30.setMinutes(timePlus30.getMinutes() + 30);

classMap.set("yoga", new gymClass("yoga", new Date('2022-02-17'), 100)); // This is a random future date
classMap.set("gym", new gymClass("gym", timePlus30, 200)); //this is just 30 mins from now 
classMap.set("dance", new gymClass("dance", new Date('1999-09-10'), 300)); // This is a day from the past

app.post("/book", (reques, res) => {
    let classType = reques.query.classType, name = reques.query.name

    if(!(classMap.has(classType))){
        res.status(400).json({
            messageTxt: "This class type does not exist"
        })
        return;
    }

    if((new Date()) > classMap.get(classType).startTime){
        res.status(400).json({
            messageTxt: "Sorry the class has been already started"
        })
        return ;
    }

    let booking = classMap.get(classType).bookUser(name);
    res.status(booking.statusCode).json({
        messageTxt: booking.messageTxt
    })
})

app.post("/cancel", (request, res) => {
    let classType = request.query.classType, name = request.query.name

    if(!(classMap.has(classType))){
        res.status(400).json({
            messageTxt: "This class type does not exist"
        })
        return ;
    }

    let timeAfter30 = new Date();
    timeAfter30.setMinutes(timeAfter30.getMinutes() + 30);
    if(timeAfter30 > classMap.get(classType).startTime){
        res.status(400).json({
            messageTxt: "Sorry you can only cancel a class upto 30 min before the class starts"
        })
        return ;
    }

    let cancellation =  classMap.get(classType).cancelUser(name);

    if(cancellation){
        res.status(200).json({
            messageTxt: "Successfully cancelled"
        })
    }
    else{
        res.status(400).json({
            messageTxt: "User is not booked in this class"
        })
    }

    

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})