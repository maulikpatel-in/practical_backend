const createHttpError = require('http-errors');
const logger = require('../../utils/logger');
const services = require('./testimonial.service');

exports.get = async (req, res) => {
  try {
    let data = await services.list();
    return res.status(200).json({
      error: false,
      message: 'Testimonial List.',
      data: data.length > 0 ? data : []
    });
  } catch (error) {
    logger.error(error);
    createHttpError(400, 'No Data Found!');
  }
};

exports.add = async (req, res) => {
  try {
    console.log(req.body);
    let data = await services.add(req.body);

    if (data) {
      return res.status(200).json({
        error: false,
        message: 'Testimonial Created Successfully.',
        data: data
      });
    }

    return createHttpError(400, 'Error while creating testimonial.');
  } catch (error) {
    logger.error(error);
    createHttpError(400, 'No Data Found!');
  }
};

exports.update = async (req, res) => {
  try {
    let data = await services.update(req.params.id, req.body);
    if (data) {
      return res.status(200).json({
        error: false,
        message: 'Testimonial Updated Successfully.',
        data: data
      });
    }

    return createHttpError(400, 'Error while updating testimonial.');
  } catch (error) {
    logger.error(error);
    createHttpError(400, 'No Data Found!');
  }
};

exports.delete = async (req, res) => {
  try {
    let data = await services.delete(req.params.id);
    if (data) {
      return res.status(200).json({
        error: false,
        message: 'Testimonial Deleted Successfully.'
      });
    }
    return createHttpError(400, 'Error while deleting testimonial.');
  } catch (error) {
    logger.error(error);
    createHttpError(400, 'No Data Found!');
  }
};
