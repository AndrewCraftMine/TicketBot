const { Message, MessageEmbed } = require('discord.js') 
const UtilityEmbed = require('../../utils/UtilityEmbeds')

const Client = require('../../utils/TicketSystem')
const client = new Client({
    partials: ["MESSAGE", "USER", "REACTION"]
})

module.exports = {
    name: 'setuptickets',
    description: 'setting up the ticket system',
    category: 'Setup',

    /**
     * @param {Message} message
     * @param {Client} client
     * @param {String[]} args
     */

    run: async (client, message, args) => {
        const UtilityEmbeds = new UtilityEmbed()

        let chosenChannel = message.mentions.channels.first()
        if (!chosenChannel) {
            return (
                message.channel.send(UtilityEmbeds.errEmbed(
                    `Wrong format! Use >setuptickets <channel>`,
                    `Triggered by ${message.author.tag}`
                ))
            )
        }

        const ticketembed = new MessageEmbed()
        ticketembed.setTitle('✉️  Ticket Support  ✉️')
        ticketembed.setDescription('To create a ticket, react with ✉️.')
        ticketembed.setColor('9933FF')
        ticketembed.setFooter('React Below')
        
        await chosenChannel.send(ticketembed)
        .then(messageReaction => {
            messageReaction.react('✉️')
        })

        message.delete()

        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) {
                return;
            }

            reaction.users.remove(user)

            let guild = reaction.message.guild
            guild.channels.create(`ticket-${user.username}`, {
                permissionOverwrites: [
                    {
                        id: user.id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    },
                    {
                        id: reaction.message.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: reaction.message.guild.roles.cache.get('754040482233057340'),
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    }
                ]
            })

            .then(ch => {
                const embed = new MessageEmbed()
                embed.setTitle(`✉️  Ticket-${user.tag}  ✉️`)
                embed.setDescription('Support will be with you shortly.')
                embed.addField('Please explain your problem here.', 'If this was a mistake, please react say so over here, and a staff member will close the ticket.')
                embed.setColor('9933FF')
                embed.setFooter(`Help requested by ${user.tag}`)
                ch.send(embed)
            })
        })
    }
}




