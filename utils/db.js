const mongoose = require('mongoose');
const logger = require('./logger');

exports.getConnection = async config => {
  await mongoose
    .connect(config.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      logger.info('Mongodb Connected');
    })
    .catch(err => {
      logger.error('Error to Connect Mongodb as ', err);
    });
  mongoose.set('debug', true);
  return mongoose;
};
