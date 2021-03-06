require('dotenv').config()

const mongoose = require('mongoose')
const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')

const Server = require('./models/Server')

const VoiceStateUpdate = require('./controllers/VoiceStateUpdateController')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

// Requiring command files
client.commands = new Collection()

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.data.name, command)
}


// Connect to database
mongoose.connect(process.env.DB_URI, () =>
	console.log('   -> Connected to DB')
)


// Events
client.once('ready', () => console.log('Running!'))

client.on('guildCreate', ({ id }) => {
	const server = new Server({ _id: id })
	server.save()
})

client.on('voiceStateUpdate', (oldState, newState) => {
	if (oldState.channelId === null) {
		VoiceStateUpdate.join(oldState, newState)
	}
	else if (newState.channelId === null) {
		VoiceStateUpdate.quit(oldState, newState)
	}
	else {
		VoiceStateUpdate.quit(oldState, newState)
		VoiceStateUpdate.join(oldState, newState)
	}

})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return

	const command = client.commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
	}
})


client.login(process.env.TOKEN)
