const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model('Page', PageSchema);
