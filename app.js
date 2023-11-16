const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes')

// express app
const app = express();

// Connect to MongoDB
const dbURI = process.env.MONGO_PASS

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "node-tuts"
}
mongoose.connect(dbURI, connectionParams)
    .then(() => {
        console.log("Connected to the database")
        app.listen(3000);
    })
    .catch((err) => {
        console.log(`Error connecting to the database. ${err}`)
    })

// Register view engine
app.set('view engine', 'ejs')

// Middleware and static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {
    res.render('about', { title: "About" });
})

// Blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: "404" })
})