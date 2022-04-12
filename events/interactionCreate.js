module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    //Slash Commands
    if (interaction.isCommand()) {
      let commandExecute = interaction.commandName;

      if (interaction.options.getSubcommand(false) != null) {
        commandExecute = interaction.commandName + interaction.options.getSubcommand(false);
      }

      const command = interaction.client.slashCommands.get(commandExecute);

      if (command.devOnly && interaction.user.id !== interaction.client.application?.owner?.id) {
        await interaction.reply("This command is Dev only.");
        return;
      }

      await checkDB(interaction)

      try {
        await interaction.deferReply();
        command.execute(interaction);
      } catch (e) {
        log(e, "ERROR");
      }
    }

    //Buttons
    if (interaction.isButton()) {
      if (interaction.customId === "troll") {
        await interaction.deferUpdate();
        const comps = interaction.message.components[0];
        comps.components[0].label = "Claimed";
        comps.components[0].disabled = true;
        await interaction.editReply({ components: [comps] });
        await interaction.followUp({
          files: ["https://tenor.com/view/rick-roll-rick-ashley-never-gonna-give-you-up-gif-22113173.gif"],
          ephemeral: true,
          content: "<:troll:926607514999615499>",
        });
      }
    }
  },
};

async function checkDB(int) {
  int.client.mongo.db("DEV").collection("game").updateOne(
    { _id: int.user.id },
    { $set: {
      tag: int.user.tag
    }},
    { upsert: true }
  )
}