const Bull = require('bull')
const Queue = new Bull('email-scheduler',"redis://127.0.0.1:6379")

const addScheduler = async (data)=>{
    try{
      console.log("--------------------------------")
      console.log('job added ==>',{data})
      await Queue.add(data,{removeOnComplete:true})
    //  setTimeout(()=>{
    //      addScheduler({name:'vrund',email:"test@gmail.com"})
    //  },5000)
     return
    }catch(error){
     console.log(error)
     return error
    }
}

const processJobs = async (job,done)=>{
    try{
        console.log('job processing ==>')
        console.log('job id:',job.id)
        console.log('job data:',job.data)
        done(null,'success')
    }catch(error){
        console.log(error)
        done(null,error)
        return error
    }
}


const initScheduler = ()=>{
    Queue.process(processJobs)
    Queue.on('completed',(job)=>{
        console.log('job completed ==>',job.data)
    })
    Queue.on('failed',(job)=>{
        console.log('job failed ==>',job.id)
    })
    Queue.on('stalled',(job)=>{
        console.log('job stalled ==>',job.id)
    })
}

// setTimeout(()=>{
//     console.log('called')
//     addScheduler({name:'testing',email:'bipin.c@yudiz.com'})
// },1000)

initScheduler()

module.exports = {
    addScheduler
}