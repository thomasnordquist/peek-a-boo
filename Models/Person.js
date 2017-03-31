const moment = require('moment')
const axios = require('axios')
const gravatarLoader = require('gravatar')

module.exports = class Person {
  constructor({ email, name, gravatar, github, githubAvatar, devices }) {
    this.email = email
    this.name = name
    this.gravatar = gravatar || ''
    this.githubAvatar = githubAvatar || ''
    this.github = github || ''
    this.devices = devices || []
  }

  getAvatar() {
    return this.githubAvatar || this.gravatar
  }

  getGithubAvatar() {
    return axios.get(`https://api.github.com/users/${this.github}`)
      .then(response => response.data.avatar_url)
      .catch(() => console.log('could not load github avatar for', this))
  }

  async updateAvatars() {
    if (typeof window !== 'undefined') {
      console.error('Cant load avatars in browser')
    }

    this.gravatar = gravatarLoader.url(this.email, { s: '256', r: 'x', d: 'mm' })
    this.githubAvatar = await this.getGithubAvatar()
  }

  lastSeen() {
    const lastSeenDevice = this.devices
      .filter(device => device.lastSeen)
      .sort((a, b) => moment(a.lastSeen) < moment(b.lastSeen))[0]

    if (lastSeenDevice) {
      return lastSeenDevice.lastSeen
    }
    return null
  }
}
