const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../index");
const config = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription(`K3S 👑`)
    .addUserOption(option => option.setName("membre").setDescription("💎").setRequired(true))
    .addStringOption(option =>
      option.setName('type')
        .setDescription('💎')
        .setRequired(true)
        .addChoices(
          { name: 'Nitro Boost', value: 'nitro_boost' },
          { name: 'Nitro Basic', value: 'nitro_basic' },
        ))
    .addNumberOption(option =>
      option.setName('quantitée')
        .setDescription('💎')
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    if (await db.get(`owner.${interaction.user.id}`) === null && interaction.user.id !== config.owner) return;

    const member = interaction.options.getMember('membre');
    const type = interaction.options.getString("type");
    const quantity = interaction.options.getNumber("quantitée");
    let typee;

    if (type === "nitro_boost") typee = "Nitro Boost";
    if (type === "nitro_basic") typee = "Nitro Basic";
    if (member.user.bot) return;

    if (await db.has(type) === null) await db.set(type, []);

    const item = await db.get(type);
    if (item.length < quantity) {
      return await interaction.reply({ content: `❌ **Vous devez avoir __${quantity}+__ liens ${typee}.**`, ephemeral: true });
    }

    const code = item.slice(0, quantity);
    const codes = item.slice(quantity);
    const codeList = code.map((code, index) => `${index + 1}. ${code}`).join("\n");

    async function sendCodes() {
      try {
        await member.send(`${codeList}`);
        return true;
      } catch (e) {
        return false;
      }
    }

    const codesSent = await sendCodes();
    if (codesSent) {
      await db.set(type, codes);
      return await interaction.reply({ content: `**__${quantity}__ liens ${typee} ont été envoyés à __${member.user.username}__**`, ephemeral: true });
    } else {
      return await interaction.reply({ content: `**Les __DM__ de __${member.user.username}__ sont fermés.**`, ephemeral: true });
    }
  },
};
