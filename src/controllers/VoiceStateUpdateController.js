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

  async quit(oldState, newState, crowdBonusCheck) {
    // Deaf or muted
    const deafOrMuted = oldState.serverDeaf || oldState.selfDeaf || oldState.serverMute || oldState.selfMute

    if (deafOrMuted) return

    // Find member
    const serverId = oldState.guild.id
    const memberId = oldState.id

    const server = await Server.findById(serverId)
    const member = server.members.id(memberId)

    if (!member) return

    // Calculate bonus
    const { streaming, selfVideo } = oldState
    let crowd = 1
    const channelId = oldState.channelId
    const channel = await oldState.guild.channels.fetch(channelId)
    const activeMembers = channel.members.filter(member => {
      const voiceState = member.voice
      const memberDeafOrMuted = voiceState.serverDeaf || voiceState.selfDeaf || voiceState.serverMute || voiceState.selfMute
      
      return memberDeafOrMuted ? false : true
    })

    if (activeMembers.size >= server.minMembersToCrowd - 1) {
      if (crowdBonusCheck) {
        activeMembers.forEach(member => {
          const voiceState = member.voice
  
          this.quit(voiceState, oldState, false)
          this.join(voiceState, voiceState)
        })
      }

      crowd = server.crowd.value
    }


    const now = new Date

    let xpEarned = (now.getTime() - member.lastJoin.getTime()) / 10000

    xpEarned *= streaming ? server.streamingBonus : 1
    xpEarned *= selfVideo ? server.videoBonus : 1
    xpEarned *= crowd

    xpEarned = Math.round(xpEarned)

    member.currentXp += xpEarned
    await server.save()
  }
}