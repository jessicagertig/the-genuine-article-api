const { dailyGarmentJob } = require('../api/daily-garment-model');

module.exports = async (req, res) => {
  try {
    await dailyGarmentJob();
    console.log('Job ran!!!');
    res.status(200).send('Daily garment job completed successfully');
  } catch (error) {
    console.error('Error in daily garment job:', error);
    res.status(500).send('Error in daily garment job');
  }
};
