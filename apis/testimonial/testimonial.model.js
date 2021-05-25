const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    Name: String,
    Photo: String,
    Post: String,
    Testimonial_Description: String,
    Active: {
      type: Number,
      default: 1,
      enum: [0, 1]
    }
  },
  {
    timestamps: true
  }
);

const Testimonial = mongoose.model('testimonial', testimonialSchema);

module.exports = Testimonial;
