const express = require("express");
const router = express.Router();

const Event = require("../models/EventSchema");

router.get("/", (req, res) => {
  Event.find().then((events) => {
    res.json(JSON.parse(events[0].data));
  });
});

router.post("/", (req, res) => {
  const newItem = new Event({
    data: req.body.data,
    item: req.body.item,
  });

  Event.findOneAndDelete({ item: newItem.item }, (err, doc) => {
    if (err) console.error(err);
    newItem.save().then((event) => {
      res.json(event);
    });
  });
});

module.exports = router;
