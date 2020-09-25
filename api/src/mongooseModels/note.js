const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please provide note\'s text' ]
    },
    timeStamp: {
        type: Number,
        required: [true, 'Please provide a timeStamp' ]
    },
    important: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: [true, 'Please provide user\'s id' ]
    }
})


const Note = mongoose.model('Note', noteSchema)

module.exports = Note