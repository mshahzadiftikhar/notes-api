/*
    * Health Controller
    * This controller handles health check requests to verify that the API is running.
*/ 
const healthCheck = (req, res) => {
  console.log('Health check controller called');

  res.status(200).json({
    status: 'OK',
    message: 'Notes API is running'
  });
};

module.exports = {
  healthCheck
};