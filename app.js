const Discord = require("discord.js");
const client = new Discord.Client();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/oppa_bot");

const User = require("./models/user");
const Guild = require("./models/guild");

const TOKEN = "NDcyOTMwNjgxNjc3NDE0NDA5.Dj6ikQ.vMSZFO5SVJtWPNMtRtlh8beebWw";
const PREFIX = "oppa";

client.on('ready', () => {
  console.log("discord bot -> (" + client.user.tag + ") has started");
});

client.on('guildCreate', guild => {
    
    Guild.create({
        discordId: guild.id,
        users: []
    }, function(err, newGuild) {
        if(err) {
            console.log(err);
        } else {
            console.log("bot has been added by a server");
            var welcomeMessage = "みんなさん, HELLOです～ 私Oppaですね~　😊\n" 
                    + "I am your sugar daddy\n"
                    + "`oppa start` and i give u money";
            var firstChannel = guild.channels.find(guildChannel => (guildChannel.permissionsFor(guild.me).has("SEND_MESSAGES") && guildChannel.type === "text"));
            if(firstChannel != undefined) {
              firstChannel.send(welcomeMessage);
            }
        }
    });
});

client.on('guildDelete', guild => {
    Guild.deleteMany({
        discordId: guild.id
    }, function(err) {
        if(err) {
            console.log(err);
        } else {
            
        }
    });
});

client.on('message', message => {
    if(message.content.startsWith(PREFIX + " ")) {
        var messageString = message.content.substr(PREFIX.length + 1);
        switch(messageString.split(" ")[0]) {
            case "start" : routeStart(message); break;
            case "money" : routeMoney(message); break;
            case "daily" : routeDaily(message); break;
			case "give"  : routeGive(message);  break;
			case "take"  : routeTake(message); break;
			// case "bet"   : routeBet(message); break;
			case "rant"  : routeRant(message); break;
            default: routeCommandNotFound(message);
        }
    }
});

// =================== COMMANDS ROUTES ===================

function routeStart(message) {
    User.count({discordId: message.author.id}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else if(foundUser == 0) {
            User.create({
                discordId: message.author.id,
                money: 0,
                lastDailyReceived: null
            }, function(err, newUser) {
                if(err) {
                    console.log(err);
                } else {
                    Guild.findOne({discordId: message.guild.id}, function(err, foundGuild) {
                        if(err) {
                            console.log(err);
                        } else {
                            foundGuild.users.push(newUser);
                            foundGuild.save();
                            message.channel.send("You have been adopted by Oppa!");
                            console.log("new user added: " + message.author.username);
                        }
                    });
                }
            });
        }
    });
}

function routeMoney(message) {
    User.findOne({discordId: message.author.id}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else if(foundUser == null) {
            message.channel.send("You are not my maknae, type `oppa start`");
        } else {
			message.channel.send("You have " + foundUser.money + " Appa 💰");
		}
    });
}

function routeDaily(message) {
    User.findOne({discordId: message.author.id}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else if (foundUser != null) {
            var dateRightNow = new Date();
            var foundUserDate = foundUser.lastDailyReceived;
            if(foundUserDate == null) {
                var randomMoney = Math.floor(Math.random() * 100) + 1;
                if(randomMoney == 69) randomMoney =  Math.floor(Math.random() * 100) + 1 * 100;
                foundUser.money += randomMoney;
                message.channel.send("You have received " + foundUser.money + " Appa");
                foundUser.lastDailyReceived = new Date();
                foundUser.save();
            } else {
				var advDate = new Date();
				advDate.setDate(advDate.getDate() + 1);
                var hasGottenDaily = dateRightNow < advDate;
                if(hasGottenDaily) {
                    message.channel.send("You have received your daily already\nLast received date: " + foundUser.lastDailyReceived);
                } else {
                    var randomMoney = Math.floor(Math.random() * 100) + 1;
                    if(randomMoney == 69) randomMoney =  Math.floor(Math.random() * 100) + 1 * 100;
                    console.log("money sent: " + randomMoney);
                    foundUser.money += randomMoney;
                    foundUser.lastDailyReceived = dateRightNow;
                    message.channel.send("You have received " + randomMoney + " Appa");
                    foundUser.save();
                }
            }
        } else {
            message.channel.send("Oppa hasn't adopted you yet! `oppa start` to get adopted");
        }
    });
}

function routeGive(message) {
	try {
		if(message.author.id == 286019582823497739) {
			var userId = message.content.split(" ")[2];
			var money = parseFloat(message.content.split(" ")[3]);
			User.findOne({discordId: userId}, function(err, foundUser) {
				if(err) {
					console.log(err);
				} else {
					foundUser.money += money;
					foundUser.save();
					message.channel.send("Money sent: " + money);
				}
			});
		} else {
			message.channel.send("Unauthorized access");
		}
	} catch (error) {
		console.log(error);
	}
}

function routeTake(message) {
	try {
		if(message.author.id == 286019582823497739) {
			var userId = message.content.split(" ")[2];
			var money = parseFloat(message.content.split(" ")[3]);
			User.findOne({discordId: userId}, function(err, foundUser) {
				if(err) {
					console.log(err);
				} else {
					foundUser.money -= money;
					foundUser.save();
					message.channel.send("Money taken: " + money);
				}
			});
		} else {
			message.channel.send("Unauthorized access");
		}
	} catch (error) {
		console.log(error);
	}
}

function routeBet(message) {
	try {
		var money = parseFloat(message.content.split(" ")[2]);
		
		User.findOne({discordId: message.author.id}, function(err, foundUser) {
			if(err) {
				console.log(err);
			} else {
				foundUser.money += money;
				foundUser.save();
				message.channel.send("Money taken: " + money);
			}
		});
	} catch (error) {
		console.log(error);
	}
}

function routeRant(message) {
	message.channel.send("Nani the fuck did you just fucking iimasu about watashi," 
	+ " you chiisai bitch desuka? Watashi’ll have anata know that watashi graduated " 
	+ "top of my class in Nihongo 3, and watashi’ve been involved in iroirona Nihongo " 
	+ "tutoring sessions, and watashi have over sanbyaku perfect test scores. Watashi am " 
	+ "trained in kanji, and watashi is the top letter writer in all of southern California. " 
	+ "Anata are nothing to watashi but just another weaboo. Watashi will korosu " 
	+ "anata the fuck out with vocabulary the likes of which has never been mimasu’d " 
	+ "before on this continent, mark watashino fucking words. Anata thinks anata can " 
	+ "get away with hanashimasing that kuso to watashi over the intaaneto? Omou again, " 
	+ "fucker. As we hanashimasu, watashi am contacting watashino secret netto of otakus " 
	+ "across the USA, and anatano IP is being traced right now so you better junbishimasu " 
	+ "for the ame, ujimushi. The ame that korosu’s the pathetic chiisai thing anata calls " 
	+ "anatano life. You’re fucking shinimashita’d, akachan.");
}

function routeHelp(message) {
    
}

function routeCommandNotFound(message) {
    
}

// ======================================================

client.login(TOKEN);