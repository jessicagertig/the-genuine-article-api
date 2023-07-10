const { dailyGarmentJob } = require('../items/daily-garment-model');

module.exports = async (req, res) => {
  try {
    await dailyGarmentJob();
    res.status(200).send('Daily garment job completed successfully');
  } catch (error) {
    console.error('Error in daily garment job:', error);
    res.status(500).send('Error in daily garment job');
  }
};
