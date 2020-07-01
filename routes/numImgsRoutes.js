const express = require("express");
const router = express.Router();

const NumImgs = require("../models/NumImgsSchema");

router.get("/", (req, res) => {
  NumImgs.find().then((events) => {
    res.json(events);
  });
});

router.post("/", (req, res) => {
  const newItem = new NumImgs({
    numImgs: req.body.numImgs,
    item: req.body.item,
  });

  NumImgs.findOneAndDelete({ item: newItem.item }, (err, doc) => {
    if (err) console.error(err);
    newItem.save().then((event) => {
      res.json(event);
    });
  });
});

module.exports = router;
