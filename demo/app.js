const express = require('express')
const moment = require('moment')

const {scheduleMatchTask} = require('./customScheduler')
const {addScheduler} = require('./queue')

const pid = process.pid

console.log({pid})


const app = express()

app.get('/send-email',async (req,res)=>{

    //add scheduler
    await addScheduler({name:'testing',email:'test@gmail.com'})
    res.send(`OK ==> process is handled by ${pid}`)
})

app.get('/test',async (req,res)=>{
    await scheduleMatchTask({eType:'test',data:{note:'custom scheduler problem'}},moment().add('5','second').unix())
    res.send(`OK ==> process is handled by ${pid}`)
})

app.get('*',(req,res)=>res.send('OK'))

app.listen({port:8000},()=>console.log('server is running...'))