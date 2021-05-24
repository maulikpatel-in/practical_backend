const { testimonialRoutes } = require('../apis/testimonial');

exports.initialize = app => {
  app.use('/api/testimonial', testimonialRoutes);

  app.get('/ping', (req, res) => {
    res.status(200).send({
      error: true,
      ping: 'pong',
      statusCode: 200
    });
  });
};
