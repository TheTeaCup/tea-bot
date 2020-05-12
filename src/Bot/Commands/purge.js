const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars
  const Konah = Koala.emojis.get("456305427236257804");
  const KoHelp = Koala.emojis.get("456211147406835713");
  
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    return message.channel.send("You don't have \`Manage Messages\` permissions.");
  };
  
  if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
    return message.channel.send("I don't have \`Manage Messages\` permissions.");
  };
  
  const User = message.mentions.users.first();
  const MessageAmount = !!parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
  
  if (!MessageAmount) {
    return message.channel.send("Please specify an amount to \`purge\`.");
  };
  
  if (!MessageAmount && !User) {
    return message.channel.send(" You must specify a user and amount, or just an amount, of messages to \`purge\`.");
  };
  
  message.channel.fetchMessages({ limit: MessageAmount + 1 }).then((messages) => {
    if (User) {
      const filterBy = User ? User.id : Koala.user.id;
      messages = messages.filter(msg => msg.author.id === filterBy).array().slice(0, MessageAmount);
    };
    
    message.channel.bulkDelete(messages).then(mesessages => {
      return message.channel.send("Successfully \`Purged\`.");
    }).catch(() => { return; });
  });
};

exports.help = {
  name: "purge",
  description: "Allows you to delete a certain amount of messages.",
  usage: "k!Purge <1-100>"
};

exports.conf = {
  Aliases: [ "delete" ]
};