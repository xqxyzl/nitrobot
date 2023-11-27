const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../index")
const config = require("../../config")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unowner")
    .setDescription("K3S 👑")
    .addUserOption(option => (
        option.setName("membre")
        .setDescription("💎")
        .setRequired(false)
    )),
    run: async (client, interaction) => {
        if(interaction.user.id !== config.owner) return;
        const member = interaction.options.getMember('membre');
        if(!member) {
            const ownerList = await db.all(`owner.`);

            if (ownerList.length === 0) {
                const embed = new MessageEmbed()
                .setTitle("Liste des Owners")
              return interaction.reply({ embeds: [embed] })
            }
        
            const fetchedOwners = await Promise.all(ownerList.map(async (item) => {
              const userId = item.split('.')[1];
              try {
                const user = await client.users.fetch(userId);
                return { userId, username: user.username };
              } catch (error) {
                return { userId, username: null };
              }
            }));
        
            const itemsPerPage = 10;
            const maxPages = Math.ceil(fetchedOwners.length / itemsPerPage);
            let messageSent;
        
            const sendOwners = async (currentPage) => {
              const start = currentPage * itemsPerPage;
              const end = start + itemsPerPage;
              const cItems = fetchedOwners.slice(start, end);
        
              const embed = new MessageEmbed()
                .setTitle("Liste des Owners")
                .setDescription(cItems.map(item => `${item.username ?? 'Null'} - ${item.userId}`).join("\n"))
                .setFooter({ iconURL: client.user.displayAvatarURL(({ dynamic: true })), text: "discord.gg/k3s 👑" })
              const row = new MessageActionRow();
              const backButton = new MessageButton()
                .setCustomId('previous')
                .setEmoji('◀️')
                .setStyle("SECONDARY")
                .setDisabled(currentPage === 0);
        
              const nextButton = new MessageButton()
                .setCustomId('next')
                .setEmoji('▶️')
                .setStyle("SECONDARY")
                .setDisabled(currentPage === maxPages - 1);
        
              const pageButton = new MessageButton()
                .setCustomId('pages')
                .setLabel(`${currentPage + 1}/${maxPages}`)
                .setStyle('SECONDARY')
                .setDisabled(true);
    
                const k3sButton = new MessageButton()
                .setLabel(`K3S 👑`)
                .setURL("https://discord.gg/k3s")
                .setStyle("LINK")
              row.addComponents(backButton, pageButton, nextButton, k3sButton);
        
              if (!messageSent) {
                messageSent = await interaction.reply({
                  embeds: [embed],
                  components: [row],
                  fetchReply: true
                });
              } else {
                await messageSent.edit({
                  embeds: [embed],
                  components: [row],
                  fetchReply: true
                });
              }
        
              const memberFilter = i => (i.customId === 'previous' || i.customId === 'next') && i.user.id === interaction.user.id;
              const collector = messageSent.createMessageComponentCollector({
                filter: memberFilter,
                time: 500000
              });
        
              collector.on('collect', async (interaction) => {
                if (!interaction.deferred || !interaction.replied) {
                  await interaction.deferUpdate();
                }
                if (interaction.isButton()) {
                  if (interaction.customId === 'previous' && currentPage > 0) {
                    currentPage--;
                  } else if (interaction.customId === 'next' && currentPage < maxPages - 1) {
                    currentPage++;
                  }
                  await sendOwners(currentPage);
                }
              });
        
              collector.on('end', () => {
                messageSent.edit({
                  components: []
                }).catch(console.error);
              });
            };
        
            return await sendOwners(0);
        }
        if(await db.get(`owner.${member.user.id}`) === null) return interaction.reply({ content: `❌ **__${member.user.username}__ n'est pas __owner__.**` })
        await db.delete(`owner.${member.user.id}`)
         return interaction.reply({ content: `✅ **__${member.user.username}__ n'est plus __owner__.**` })
    }
 };
