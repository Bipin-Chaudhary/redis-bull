//create new queue
const Queue = require('bull');

//create a new queue name video transcoding
const videoQueue = new Queue('video transcoding', 'redis://127.0.0.1:6379');

//add data to queue
videoQueue.add({ video: 'http://example.com/video1.mov' });
videoQueue.add({ video: 'http://example.com/video2.mov' });
videoQueue.add({ video: 'http://example.com/video3.mov' });

// process by name of the queue
transcoderQueue.process('image', processImage);

//process the data
videoQueue.process(function (job) { 
    return fetchVideo(job.data.url).then(transcodeVideo);   
  // Handles promise rejection
  return Promise.reject(new Error('error transcoding'));

  // Passes the value the promise is resolved with to the "completed" event
  return Promise.resolve({ framerate: 29.5 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  throw new Error('some unexpected error');
  // same as
  return Promise.reject(new Error('some unexpected error'));
})