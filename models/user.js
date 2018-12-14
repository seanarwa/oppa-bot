var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    discordId: String,
    money: Number,
    lastDailyReceived: Date
});

module.exports = mongoose.model("User", userSchema);