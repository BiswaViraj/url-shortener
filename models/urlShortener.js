const mongoose = require('mongoose')
const { nanoid } = require('nanoid')
const urlShortenerSchema = new mongoose.Schema({

    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: () => nanoid(5).toLowerCase(),
        unique: true
    }
})


module.exports = mongoose.model('urlShortener', urlShortenerSchema)