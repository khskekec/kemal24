const _createEventType = type => data => (JSON.stringify({
    type,
    data,
    date: (new Date()).toString()
}));

const eventCreated = _createEventType('EVENT_CREATED');
const eventDeleted = _createEventType('EVENT_DELETED');
const websocketWelcome = () => _createEventType('WS_WELCOME')({
    message: 'Welcome to Kemal24 WS Service'
})


export {
    eventCreated,
    eventDeleted,
    websocketWelcome
}