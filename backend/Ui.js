nanconst inheritance = require('util')
const EventEmitter = require('events').EventEmitter
const UIEvents = require('../Events/UIEvents')

/**
 * The Emitter couples events from a socket to the events of the backend
 * @param target
 * @param source
 * @param uiEvent
 * @param prependEmitter when true, the first argument of the function will be the emitter itself
 * @constructor
 */
const UIEmitter = function (target, source, uiEvent, prependEmitter) {
  this.event = uiEvent

  const emit = function () {
    const args = Array.prototype.slice.call(arguments)

    if (typeof (prependEmitter) !== 'undefined' && prependEmitter == true) {
      args.unshift(target)
    }

    args.unshift(uiEvent)
    target.emit(...args)
  }

  this.remove = function () {
    source.removeListener(uiEvent, emit)
  }

  source.on(uiEvent, emit)
}

const UI = function (socket) {
  EventEmitter.call(this)

  const listeners = []
  const actors = []
  const uiSocket = socket

    /**
     * Creates an actor which emits events from the socket whith this object
     */
  this.actOn = function (uiEvent) {
    actors.push(new UIEmitter(this, socket, uiEvent, true))
  }

  this.listenTo = function (uiEvent) {
    if (typeof (this.findListener(uiEvent)) === 'undefined') {
      listeners.push(new UIEmitter(socket, this, uiEvent))
    } else {

    }
  }

  this.findListener = function (event) {
    return listeners.find(item => (item.event == event))
  }

  this.removeEvent = function (event) {
    const listener = listeners.find(item => (item.event == event))

    if (typeof (listener) !== 'undefined') {
      listener.remove()
      listeners.splice(listeners.indexOf(listener))
    }
  }

  this.addInvocation = function (invocation) {
    this.on(invocation.event, invocation.func)
  }
}

const SocketUI = function (collection, app) {
  const self = this
  this.clients = []
  this.socket = require('socket.io')(app)

  this.socket.on('connection', (socket) => {
    const ui = new UI(socket)

    self.clients.push(ui)
    collection.register(ui)

    socket.on('disconnect', self.disconnect)
  })

  this.socket.on('error', () => {

  })

  this.disconnect = function (socket) {

  }
}

const UICollection = function () {
  const interfaces = []
  const invokeStore = []

  this.register = function (ui) {
    interfaces.push(ui)
    this.registerEvents(ui)
  }

  this.findInterfaces = function (ui) {
    if (!Array.isArray(ui)) {
      ui = [ui]
    }

    return ui.filter(item => interfaces.indexOf(item) != -1)
  }

  this.emit = function (event, target, data) {
    const targetInterfaces = this.findInterfaces(target)
    if (typeof (targetInterfaces) !== 'undefined') {
      targetInterfaces.forEach((ui) => {
        ui.emit(event, data)
      })
    } else {
            /* todo: implement logging */
    }
  }

  this.all = function () {
    return interfaces.slice(0)
  }

  this.on = function (event, func) {
    const invocation = { event, func }
    invokeStore.push(invocation)

    interfaces.forEach((ui) => {
      ui.addInvocation(invocation)
    })
  }

  this.registerEvents = function (ui) {
    invokeStore.forEach((invocation) => {
      ui.addInvocation(invocation)
    })

    ui.listenTo(UIEvents.deviceDiscovered)
    ui.listenTo(UIEvents.deviceDisappeared)
    ui.listenTo(UIEvents.personUpdateNotification)
    ui.listenTo(UIEvents.deviceUpdateNotification)
    ui.listenTo(UIEvents.addPersonNotification)
    ui.listenTo(UIEvents.persons)
    ui.listenTo(UIEvents.devices)
    ui.listenTo(UIEvents.notifyPersonOnline)
    ui.listenTo(UIEvents.notifyPersonOffline)

    ui.actOn(UIEvents.createPerson)
    ui.actOn(UIEvents.getPersons)
    ui.actOn(UIEvents.getDevices)
    ui.actOn(UIEvents.setOwnerOfDevice)
  }

    /**
     * Used to remove all non-printable information
     */
  function filterValues(obj) {
    if (typeof obj.printableValues !== 'undefined') {
      obj = obj.printableValues()
    }
    return obj
  }
}

inheritance.inherits(UI, EventEmitter)

function UserInterface(expressServer) {
  const collection = new UICollection()
  new SocketUI(collection, expressServer)
  return collection
}

UserInterface.UIEmitter = UIEmitter

module.exports = UserInterface
