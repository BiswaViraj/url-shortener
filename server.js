const express = require('express')
const mongoose = require('mongoose')

const urlShortener = require('./models/urlShortener')
require("dotenv").config();
const app = express()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkq3m.mongodb.net/${process.env.DB_NAME}>?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/shortUrls', async (req, res) => {
    let shortURL = '';

    await urlShortener.create({
        fullUrl: req.body.url
    }, (err, urlShortener) => {
        shortURL = urlShortener.shortUrl;

        res.send({
            shortURL: `${process.env.APP_URL}/${shortURL}`
        })
    })
})

app.get('/:shortURL', async (req, res) => {

    const shortUrl = await urlShortener.findOne({
        shortUrl: req.params.shortURL
    })

    if (!shortUrl) {
        return res.sendStatus(404)
    }

    res.redirect(shortUrl.fullUrl)
})


app.listen(process.env.PORT || 5000)