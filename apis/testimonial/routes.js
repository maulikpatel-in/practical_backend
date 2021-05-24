const createHttpError = require('http-errors');
const router = require('express').Router();
const controller = require('./testimonial.controller');

router.get('/', controller.get);

router.post('/', controller.add);

router.put('/:id', controller.update);

router.delete('/:id', controller.delete);

router.use((req, res) => {
  if (!req.route) {
    return createHttpError(404, 'Not Found!');
  }
});

module.exports = router;
