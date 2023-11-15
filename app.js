const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

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
    .catch( (err) => {
        console.log(`Error connecting to the database. ${err}`)
    })

// Register view engine
app.set('view engine', 'ejs')

// Middleware and static files
app.use(express.static('public'))
app.use(morgan('dev'))

// Mongoose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: "New Blog 2",
        snippet: "About my new blog",
        body: "More about my new blog"
    });

    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/single-blog', (req, res) => {
    Blog.findById('6554a6f21d2fc3df27f6a447')
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err)
    })
})

// routes
app.get('/', (req, res) => {
    const blogs = [
        {title: "Yoshi finds eggs", snippet: "Lorem ipsum dolor sit amet consectetur"},
        {title: "Mario finds stars", snippet: "Lorem ipsum dolor sit amet consectetur"},
        {title: "How to defeat Bowser", snippet: "Lorem ipsum dolor sit amet consectetur"}
    ]
    res.render('index', { title: "Home", blogs });
})

app.get('/about', (req, res) => {
    res.render('about', { title: "About" });
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: "Create Blog Post" });
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: "404" })
})