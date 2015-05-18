var inheritance = require('util');
var EventEmitter = require('events').EventEmitter;
var Server = require('./Server');
var UIEvents = require('../Events/UIEvents');

require('array.prototype.find');

/**
 * The Emitter couples events from a socket to the events of the backend
 * @param target
 * @param source
 * @param uiEvent
 * @param prependEmitter when true, the first argument of the function will be the emitter itself
 * @constructor
 */
var UIEmitter = function(target, source, uiEvent, prependEmitter) {
    this.event = uiEvent;

    var emit = function() {
        var args = Array.prototype.slice.call(arguments);

        if('undefined' !== typeof(prependEmitter) && prependEmitter == true) {
            args.unshift(target);
        }

        args.unshift(uiEvent);
        target.emit.apply(target, args);
    };

    this.remove = function() {
        source.removeListener(uiEvent, emit);
    };

    source.on(uiEvent, emit);
};

var UI = function(socket) {
    EventEmitter.call(this);

    var listeners = [];
    var actors = [];
    var uiSocket = socket;

    /**
     * Creates an actor which emits events from the socket whith this object
     */
    this.actOn = function(uiEvent) {
        actors.push(new UIEmitter(this, socket, uiEvent, true))
    };

    this.listenTo = function(uiEvent) {
        if(typeof(this.findListener(uiEvent)) === 'undefined') {
            listeners.push(new UIEmitter(socket, this, uiEvent))
        } else {
            
        }
    };

    this.findListener = function(event) {
        return listeners.find(function(item) {
            return (item.event == event);
        });
    };

    this.removeEvent = function(event){
        var listener = listeners.find(function(item) {
            return (item.event == event);
        });

        if(typeof(listener) !== 'undefined') {
            
            listener.remove();
            listeners.splice(listeners.indexOf(listener));
        }
    };

    this.addInvocation = function(invocation){
        this.on(invocation.event, invocation.func)
    };
};

var SocketUI = function ( collection, app ) {
    var self = this;
    this.clients = [];
    this.socket = require('socket.io')(app);

    this.socket.on('connection', function (socket) {
        var ui = new UI(socket);

        self.clients.push(ui);
        collection.register(ui);

        socket.on('disconnect', self.disconnect);
    });

    this.socket.on('error', function () {
        
    });

    this.disconnect = function (socket) {
        
    };
};

var UICollection = function () {
    var interfaces = [];
    var invokeStore = [];

    this.register = function (ui) {
        

        interfaces.push(ui);
        this.registerEvents(ui);
    };

    this.findInterfaces = function(ui){
        if(!Array.isArray(ui)) {
            ui = [ ui ];
        }

        return ui.filter(function(item) {
            return interfaces.indexOf(item) != -1;
        });
    };

    this.emit = function(event, target, data) {
        var targetInterfaces = this.findInterfaces(target);
        if('undefined' !== typeof(targetInterfaces)) {
            targetInterfaces.forEach(function(ui){
                ui.emit(event, data);
            })
        } else {
            /* todo: implement logging */
        }
    };

    this.all = function() {
        return interfaces.slice(0);
    };

    this.on = function(event, func){
        var invocation = {event:event, func:func};
        invokeStore.push(invocation);

        interfaces.forEach(function(ui) {
            ui.addInvocation(invocation);
        });
    };

    this.registerEvents = function (ui) {
        invokeStore.forEach(function(invocation) {
            ui.addInvocation(invocation);
        });

        ui.listenTo(UIEvents.deviceDiscovered);
        ui.listenTo(UIEvents.deviceDisappeared);
        ui.listenTo(UIEvents.personUpdateNotification);
        ui.listenTo(UIEvents.deviceUpdateNotification);
        ui.listenTo(UIEvents.persons);
        ui.listenTo(UIEvents.devices);

        ui.actOn(UIEvents.createPerson);
        ui.actOn(UIEvents.getPersons);
        ui.actOn(UIEvents.getDevices);
        ui.actOn(UIEvents.setOwnerOfDevice);

    };

    /**
     * Used to remove all non-printable information
     */
    function filterValues(obj) {
        if (typeof obj.printableValues !== 'undefined') {
            obj = obj.printableValues();
        }
        return obj;
    };
};

inheritance.inherits(UI, EventEmitter);

function UserInterface(options) {
    var server = new Server(options);

    var collection = new UICollection();
    new SocketUI(collection, server.server);
    return collection;
}

UserInterface.UIEmitter = UIEmitter;

module.exports = UserInterface;