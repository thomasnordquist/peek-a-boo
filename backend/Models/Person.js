module.exports = function Person(person) {
  this.name = person.name
  this.gravatar = person.gravatar
  this.email = person.email
  this.lastSeen = person.lastSeen || null
}
