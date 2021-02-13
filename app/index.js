'use strict';

const mongoose = require('mongoose');
const express = require('express');
const employees = require('./model');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const db = 'mongodb://mongodb:27017/employees';

const employeeData = [
	{
	  name: "Johns",
	  age: 21,
	  location: "Nesw York"
	},
	{
	  name: "Smisth",
	  age: 27,
	  location: "Texsas"
	},
	{
	  name: "Lsisa",
	  age: 23,
	  location: "Chicsago"
	}
  ];


mongoose.Promise = global.Promise;

mongoose.connect(db, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    connectTimeoutMS: 10000, 
    socketTimeoutMS: 45000
}, function(err)  {
    if (err)
    {
        console.log(err, true);
    }

    execute()
        .then(function (result) {
            
            console.log(result);
            
            //process.exit(22);
            
        }.bind(this))
        .catch(function(err) {
            
            console.log('ERROR: ' + err);
            
        })
    
        
    
});

async function execute() {
    
    await insertEmployees(employeeData);
    console.log('Employee Data Inserted');
 
    // sleep function to pause in between google geocoding
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    
    // read all the data
    const employeeDump = await fetchEmployeeData();
    
    // loop through the data one by one
    for (let loop in employeeDump) {
        
        const individualEmployee = await fetchIndividualRecord(employeeDump[loop]._id);
        
        await sleep(2000);
        
        console.log('Employee Data: ' + individualEmployee.name);
        
    }
    
}


function insertEmployees(employeeData) {
    return new Promise(function (resolve, reject) {
       
        employees.insertMany(employeeData, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
        
    });
}

function fetchEmployeeData() {
    return new Promise ((resolve, reject) => {
        
        employees
            .find({})
            .lean()
            .exec()
            .then(function (employeedump) {
                resolve(employeedump)
            }.bind(this))
            .catch(function (err) {
                reject(err);
            });
        
    })
}

function fetchIndividualRecord(employeeId) {
    return new Promise ((resolve, reject) => {
        
        employees
            .findOne({_id: mongoose.Types.ObjectId(employeeId)})
            .exec()
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
        
    })
}