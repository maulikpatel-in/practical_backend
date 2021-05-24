const Testimonial = require('./testimonial.model');
const logger = require('../../utils/logger');

exports.add = async data => {
  try {
    let newRecord = new Testimonial(data);
    return await newRecord.save();
  } catch (error) {
    logger.error(error);
    return new Error(error);
  }
};

exports.list = async () => {
  try {
    return await Testimonial.find().lean();
  } catch (error) {
    logger.error(error);
    return new Error(error);
  }
};

exports.delete = async _id => {
  try {
    return await Testimonial.findOneAndDelete({ _id }).lean();
  } catch (error) {
    logger.error(error);
    return new Error(error);
  }
};

exports.update = async (_id, data) => {
  try {
    let status = await Testimonial.updateOne({ _id }, data, {});

    if (status) {
      return await Testimonial.findOne({ _id }).lean();
    }
  } catch (error) {
    logger.error(error);
    return new Error(error);
  }
};
