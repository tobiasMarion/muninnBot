const Server = require('../models/Server')

module.exports = {
  async join(oldState, newState) {
    const serverId = newState.guild.id
    const memberId = newState.id
    const username = newState.member.user.username
    const tag = newState.member.user.discriminator

    const server = await Server.findById(serverId)

    const member = server.members.id(memberId)

    if (!member) {
      server.members.push({
        _id: memberId,
        username,
        tag,
      })
    } else {
      member.username = username
      member.tag = tag
      member.lastJoin = new Date
    }

    await server.save()
  },

  async quit(oldState, newState) {
    const deafOrMuted = oldState.serverDeaf || oldState.selfDeaf || oldState.serverMute || oldState.selfMute

    if (deafOrMuted) {
      return
    }

    const serverId = oldState.guild.id
    const memberId = oldState.id

    const server = await Server.findById(serverId)

    const member = server.members.id(memberId)

    if (!member) {
      return
    }

    const { streaming, selfVideo } = oldState
    const now = new Date

    let xpEarned = (now.getTime() - member.lastJoin.getTime()) / 1000

    xpEarned *= streaming ? server.streamingBonus : 1
    xpEarned *= selfVideo ? server.videoBonus : 1
    xpEarned = Math.round(xpEarned)

    member.currentXp += xpEarned
    await server.save()
  }
}