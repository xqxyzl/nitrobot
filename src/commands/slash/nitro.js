const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../index")
const config = require("../../config")
module.exports = {
  data: new SlashCommandBuilder()
  .setName('nitro')
  .setDescription(`K3S 👑`),
    run: async (client, interaction) => {
        if(await db.get(`owner.${interaction.user.id}`) === null && interaction.user.id !== config.owner) return;
        const nitroBoost = await db.get("nitro_boost") || [];
        const nitroBasic = await db.get("nitro_basic") || [];
        const nitro_boost_emoji = "1178513948602011648"
        const nitro_basic_emoji = "1178513971070902273"
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId("nitro_boost")
            .setLabel(`${nitroBoost.length}`)
            .setEmoji(nitro_boost_emoji)
            .setStyle("PRIMARY")
            .setDisabled(true),
            new MessageButton()
            .setCustomId("nitro_basic")
            .setLabel(`${nitroBasic.length}`)
            .setEmoji(nitro_basic_emoji)
            .setStyle("PRIMARY")
            .setDisabled(true)
        )

        await interaction.reply({ content: `<a:Nitro_Boost:1178513948602011648> **__${nitroBoost.length}__ Nitro Boost**\n<a:Nitro_Basic:1178513971070902273> **__${nitroBasic.length}__ Nitro Basic**`, components: [row] })
    }
 };
