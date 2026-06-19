const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

app.use(express.json());

mongoose.connect(
  "mongodb://127.0.0.1:27017/redundancyDB"
);

app.post("/add-user", async (req, res) => {

  const { name, email, phone } = req.body;

  try {

    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      return res.status(400).json({
        status: "Redundant Data",
        message: "Duplicate entry found"
      });
    }

    const similarUser = await User.findOne({
      name: name,
      phone: phone
    });

    if (similarUser) {
      return res.status(200).json({
        status: "False Positive",
        message: "Similar data exists, verify manually"
      });
    }

    const user = new User({
      name,
      email,
      phone
    });

    await user.save();

    res.status(201).json({
      status: "Unique Data",
      message: "Data stored successfully"
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
