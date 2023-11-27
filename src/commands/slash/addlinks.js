const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../index")
const config = require("../../config")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('addlinks')
  .setDescription(`K3S 👑`)
  .addStringOption(option =>
      option.setName('type')
          .setDescription('💎')
          .setRequired(true)
          .addChoices(
              { name: 'Nitro Boost', value: 'nitro_boost' },
              { name: 'Nitro Basic', value: 'nitro_basic' },
          ))
          .addStringOption(option =>
            option.setName('liens')
                .setDescription('💎')
                .setRequired(true)
            ),
    run: async (client, interaction) => {
        if(await db.get(`owner.${interaction.user.id}`) === null && interaction.user.id !== config.owner) return;
        const type = interaction.options.getString("type")
        const links = interaction.options.getString("liens").split(/\s+/);
        if(type === "nitro_boost") {
            const existingLinks = await db.get(type) || [];
            const updatedLinks = [...existingLinks, ...links];
            
            await db.set(type, updatedLinks);
            await interaction.reply({ content: `✅ **__${links.length}__ liens __Nitro Boost__ ajouté.**`, ephemeral: true })
        } else if(type === "nitro_basic") {
            const existingLinks = await db.get(type) || [];
            const updatedLinks = [...existingLinks, ...links];
            
            await db.set(type, updatedLinks);
            await interaction.reply({ content: `✅ **__${links.length}__ liens __Nitro Basic__ ajouté.**`, ephemeral: true })
        }
    }
 };
