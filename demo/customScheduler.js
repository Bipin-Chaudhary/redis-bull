const moment = require('moment')
const Redis = require('ioredis')


const options = {
    host: "127.0.0.1",
    port: "6379"
  }

const redisClient = new Redis(options)

const scheduleMatchTask = async (taskData, time) => {
    try {
      // time - timestamp format
      // taskData - {eType: String, data:{iMatchId:'',sMatchKey:"",nLatestInningNumber:1}}
  
      const exist = await redisClient.zrank('matchScheduler', JSON.stringify(taskData))
      if (typeof exist !== 'number') {
        await redisClient
          .multi()
          .zadd('matchScheduler', time, JSON.stringify(taskData))
          .exec()
      }
    } catch (error) {
      console.log({ error })
    }
  }


  
  const pollScheduler = async () => {
    try {
      let data = await redisClient.zrangebyscore(['matchScheduler', 0, moment().unix(), 'WITHSCORES', 'LIMIT', 0, 1])
      data = data[0]
  
      console.log('redis data ====>', data)
      if (data) {

        const parsedData = JSON.parse(data)
  
        await redisClient
          .multi()
          .rpush(parsedData?.eType, JSON.stringify(parsedData.data))
          .zrem('matchScheduler', data)
          .exec()
  
        pollScheduler()
      } else {
        setTimeout(() => { pollScheduler() }, 1000)
      }
    } catch (error) {
      console.log({ error })
      pollScheduler()
    }
  }
  
  
  
  const pullQueue = async () => {
      try {
          const res = await redisClient.lpop('test')
        console.log({res})
          if (!res) return setTimeout(() => pullQueue(), 10000)
          
          const data = JSON.parse(res)
          console.log({data})
          pullQueue()
        } catch (error) {
            console.log(error)
            pullQueue()
        }
    }
    
    setTimeout(() => {
      pollScheduler()
      pullQueue()
    }, 10000)

module.exports = {scheduleMatchTask}