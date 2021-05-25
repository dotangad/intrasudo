require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

const models = require("./models");

client.on("ready", () => {
  console.log("I am ready!");
});

const verification = async (message) => {
  try {
    // Check if the message mentions the bot
    if (!message.mentions.has(client.user.id)) return;

    const { author, member } = message;
    const verified = member.roles.cache.some((r) => r.name === "Verified");

    if (verified) return;

    // Check if user is in database
    const user = await models.User.findOne({ where: { discordId: author.id } });

    if (user) {
      const role = message.guild.roles.cache.find(
        (r) => r.name === "participant"
      );

      // Add the role!
      await member.roles.add(role);
      message.channel.send(`${author.toString()} verified`);
      return;
    }

    message.channel.send(
      `${author.toString()} please verify your Discord account on https://intra.sudocrypt.com`
    );
  } catch (e) {
    message.channel.send(`${message.author.toString()} an error occurred`);
    console.error(e);
  }
};

const lookup = async (message) => {
  try {
    if (!message.content.startsWith("!lookup")) return;
    const [username, discriminator] = message.content
      .split(" ")
      .pop()
      .split("#")
      .map((x) => x.trim());

    const user = await models.User.findOne({
      where: {
        discordUsername: username,
        discordDiscriminator: discriminator,
      },
    });

    if (!user) {
      message.channel.send(
        `User with username ${username}, discrimator ${discriminator} not found`
      );
      return;
    }

    message.channel.send(`https://intra.sudocrypt.com/${user.username}`);
  } catch (e) {
    message.channel.send(`${message.author.toString()} an error occurred`);
    console.error(e);
  }
};

client.on("message", (message) => {
  if (message.channel.name === "verification") verification(message);
  if (message.channel.name === "discord-lookup") lookup(message);
});

client.login(process.env.DISCORD_BOT_TOKEN);
