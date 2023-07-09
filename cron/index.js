const cron = require('node-cron');
const {
  dailyGarmentJob
} = require('../api/items/daily-garment-model');

// functions to help test jobs
function logTime() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  console.log(`Current time is: ${hours}:${minutes}`);
}

// '0 0 * * *' means at midnight or: 0 minutes past the 0th hour
// '*/2 * * * *', means every 2 units at the minutes position
const daily = '0 0 * * *';
const every_five_minutes = '*/5 * * * *';

function cronJobs() {
  console.log('Initiating Cron Jobs...');
  cron.schedule(every_five_minutes, () => {
    logTime();
  });

  cron.schedule(daily, () => {
    dailyGarmentJob();
  });
}

module.exports = cronJobs;
