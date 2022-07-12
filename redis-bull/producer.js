// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md
// https://javascript.plainenglish.io/node-js-create-job-queue-using-bull-and-redis-20fabcee60c5
const Queue = require('bull');
const queueConf = {
    redis: { port: 6379, host: '127.0.0.1', db: 12 },
}
//Queue(queueName: string, url?: string, opts?: QueueOptions): Queue
//redis://mypassword@myredis.server.com:1234


//first queue created
const allqueue = new Queue('email-queue', queueConf);
//you can give this options to queue
/*
interface QueueOptions {
  createClient?(type: 'client' | 'subscriber' | 'bclient', config?: Redis.RedisOptions): Redis.Redis | Redis.Cluster;
  limiter?: RateLimiter;
  redis?: RedisOpts;
  prefix?: string = 'bull'; // prefix for all queue keys.
  metrics?: MetricsOpts; // Configure metrics
  defaultJobOptions?: JobOpts;
  settings?: AdvancedSettings;
}
*/
async function addEmails(num) {
    try {
        await allqueue.add({ email: `b${num}@g.com` }, { lifo: true, attempts: 5 });
        //   paymentsQueue.add(paymentsData, { repeat: { cron: '15 3 * * *' } });
    } catch (error) {
        console.log(error)
    }
}
for (let i = 0; i < 2; i++) {
    addEmails(i)
}

setTimeout(function () {
    allqueue.process(async function (job) {
        try {
            return await sendResponse(job.data.email)
        } catch (error) {
            return Promise.reject('some unexpected error:' + job.data.email);
        }
    });
}, 5000)


let counter = 0;
function sendResponse(email) {
    counter++;
    console.log('counter' + counter)
    return new Promise((resolve, reject) => {
       return reject(email)
    });
}
allqueue.on('progress', function (job, progress) {
    console.log(`Job ${job.id} is ${progress * 100}% ready!`);
});

allqueue.on('completed', function (job, result) {
    console.log(`Job ${job.id} completed! Result: ${result}`);
});

allqueue.on('failed', function (job, err) {
    console.log(`failed ${job.id} job! Result: ${err}`);
})

allqueue.on('removed', function (job, data) {
    console.log(`removed ${job.id} completed! Result:`);
});


