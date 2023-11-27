const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
 name: 'ready',
 once: true,
 execute: async(client) => {
  const rest = new REST({ version: '9' }).setToken(client.token);
  const activities = [ `I`, `Hate`, 'Fake', "Friends", "K3S 👑", "discord.gg/k3s 💎" ]
  let nowActivity = 0;
  client.user.setStatus("dnd")
  function botPresence() {
  client.user.presence.set({ activities: [{ name: `${activities[nowActivity++ % activities.length]}`, type: "LISTENING" }]})
  setTimeout(botPresence, 15000)
  }
  botPresence()
  client.log(`${client.user.username} Ready`)
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: client.slashDatas },
            );
        } catch (error) {
            console.error(error);
        }
 }};
