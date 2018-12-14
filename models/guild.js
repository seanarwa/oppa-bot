var mongoose = require("mongoose");

var guildSchema = new mongoose.Schema({
    discordId: String,
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Guild", guildSchema);