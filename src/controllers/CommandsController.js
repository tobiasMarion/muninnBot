const Server = require('../models/Server')

module.exports = {
  sortXP(array) {
    return array.sort((a, b) => {
      if (a.currentXp < b.currentXp) {
        return 1
      }
      if (a.currentXp > b.currentXp) {
        return -1
      }
      // a must be equal to b
      return 0
    })
  },

  async set(type, value, serverId) {
    const server = await Server.findById(serverId)

    server[`${type}Bonus`] = value

    await server.save()
  },

  async rank(serverId) {
    let { members } = await Server.findById(serverId)

    members = this.sortXP(members).slice(0, 10)

    let reply = ':trophy: ***SERVER RANK :trophy:***\n\n'

    members.forEach((member, index) => {
      let position = ''
      switch (index) {
        case 0:
          position = ':first_place_medal:  '
          break
        case 1:
          position = ':second_place_medal:  '
          break
        case 2:
          position = ':third_place_medal:  '
          break
        default:
          position = `${index + 1}   `.padStart(6)
      }

      const name = `${member.username}#${member.tag}`
      const xp = `${member.currentXp.toLocaleString('pt-BR')} xp`

      reply += `${position} | ${name}   ---   ${xp}\n`
    })
    return reply
  },

  async position(memberId, serverId) {
    const server = await Server.findById(serverId)

    const members = this.sortXP(server.members)

    let index = members.findIndex(member => member._id == memberId)

    let reply = ''

    if (index >= 0) {
      const member = members[index]
      let end = ''

      index++

      switch (index) {
        case 1:
          end = 'st'
          break
        case 2:
          end = 'nd'
          break
        case 3:
          end = 'rd'
          break
        default:
          end = 'th'
      }

      reply = `${member.username}#${member.tag} is on ${index}${end} position in the rank`
    } else {
      reply = 'This user has no XP.'
    }

    return reply
  },

  async reset(serverId) {
    const server = await Server.findById(serverId)

    server.members.map(member => {
      member.currentXp = 0
      return member
    })

    await server.save()
  }
}