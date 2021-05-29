require("dotenv").config();

const Discord = require("discord.js");
const { decodeUsername } = require("./lib/discord");
const levelNo = require("./lib/level-no");
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
      await member.setNickname(user.name);
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
    const [username, discriminator] = decodeUsername(message.content);

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

    // message.channel.send(`https://intra.sudocrypt.com/users/${user.username}`);
    const userEmbed = new Discord.MessageEmbed()
      .setTitle(user.username)
      .addFields(
        {
          name: "Name",
          value: user.name,
        },
        {
          name: "Email",
          value: user.email,
        },
        {
          name: "Phone",
          value: user.phone,
        },
        {
          name: "Level",
          value: (await levelNo(user.currentLevelId)) - 1,
        },
        {
          name: "Finished",
          value: user.finished ? "Yes" : "No",
        },
        {
          name: "Points",
          value: `${user.points}`,
        }
      )
      .setURL(`https://intra.sudocrypt.com/users/${user.username}`)
      .setThumbnail(user.photo);
    message.channel.send(userEmbed);
  } catch (e) {
    message.channel.send(`${message.author.toString()} an error occurred`);
    console.error(e);
  }
};

client.on("message", (messageContent) => {
  if (messageContent.channel.name === "verification")
    verification(messageContent);
  if (messageContent.channel.name === "discord-lookup") lookup(messageContent);
});

client.login(process.env.DISCORD_BOT_TOKEN);
