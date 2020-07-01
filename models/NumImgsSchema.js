const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let NumImgs = new Schema({
  numImgs: {
    type: Number,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
});

module.exports = Event = mongoose.model("numImgs", NumImgs);
