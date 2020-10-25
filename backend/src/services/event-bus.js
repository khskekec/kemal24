import EventEmitter from 'events';

class EventBus extends EventEmitter {
    sendWs(data) {
        this.emit('send-ws', data)
    }
}

const eventBus = new EventBus();

export default eventBus;