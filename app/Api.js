const config = require('../config')
const axios = require('axios')

const windowPort = window.location.port || 80
const apiUrl = `${window.location.protocol}//${window.location.hostname}:${config.applicationPort ? config.applicationPort : windowPort}`

class Api {
  static getPersons() {
    console.log(apiUrl)
    return axios.get(`${apiUrl}/api/persons`)
      .then(response => response.data)
      .catch(error => console.warn(error))
  }

  static getDevices() {
    return axios.get(`${apiUrl}/api/devices`)
      .then(response => response.data)
      .catch(error => console.warn(error))
  }

  static createPerson(person) {
    return axios.put(`${apiUrl}/api/person`, person)
      .then(response => response.data)
      .catch(error => console.warn(error))
  }
}

Api.url = apiUrl

module.exports = Api
