const express = require('express')
const streamRoutes = require('./Routes/streams')
const eventRoutes = require('./Routes/events')
const eventTypes = require('./Routes/eventTypes')

const app = express();
app.use(express.json())
app.listen(3001, function () {
    console.log('Server listening on port 3001.');
});

// Route handlers
app.use('/streams', streamRoutes)
app.use('/events', eventRoutes)
app.use('/eventTypes', eventTypes)