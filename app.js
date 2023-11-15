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

// Blog Routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', {
                title: "All Blogs",
                blogs: result
            })
        })
        .catch((err) => {
            console.log(err)
        })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body)

    blog.save()
        .then((result) => {
            res.redirect('/blogs')

        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: "Create Blog Post" });
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch((err) => {
            console.log(err);
        })
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => {
            console.log(err);
        })
})



// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: "404" })
})