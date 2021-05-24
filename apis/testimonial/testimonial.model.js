const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    authorName: String,
    authorImage: String,
    authorDesignation: String,
    message: String
  },
  {
    timestamps: true
  }
);

const Testimonial = mongoose.model('testimonial', testimonialSchema);

module.exports = Testimonial;
