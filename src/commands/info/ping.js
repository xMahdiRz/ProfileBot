const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

exports.commandBase = {
  prefixData: {
    name: "ping",
    aliases: ["pong"],
  },
  slashData: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  cooldown: 5000,
  ownerOnly: false,
  async prefixRun(client, message, args) {
    const startTime = Date.now();
    const pongMessage = await message.reply("Pinging... 🏓");
    const endTime = Date.now();
    const ping = endTime - startTime;
    pongMessage.edit(`Pong! Latency is ${ping}ms. ⏱️`);
  },
  async slashRun(client, interaction) {
    console.log(await interaction.user.id)
    const startTime = Date.now();
    await interaction.reply("Pinging... 🏓");
    const endTime = Date.now();
    const ping = endTime - startTime;
    interaction.editReply(`Pong! Latency is ${ping}ms. ⏱️ <@${interaction.user.id}>`);
  }
  
};
