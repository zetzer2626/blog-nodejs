const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Serve static files from public directory
app.use(express.static('public'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());

// Method override for PUT/DELETE requests
app.use(methodOverride('_method'));

// Sample blog posts data (in a real app, this would be stored in a database)
let blogPosts = [
    {
        id: 1,
        title: "Welcome to My Blog",
        content: "This is my first blog post! I'm excited to share my thoughts and experiences with you. Stay tuned for more interesting content.",
        date: new Date().toLocaleDateString(),
        author: "Admin"
    },
    {
        id: 2,
        title: "Getting Started with Node.js",
        content: "Node.js is a powerful JavaScript runtime that allows you to build scalable network applications. In this post, I'll share some tips for beginners.",
        date: new Date().toLocaleDateString(),
        author: "Admin"
    },
    {
        id: 3,
        title: "Bootstrap for Beautiful UIs",
        content: "Bootstrap is a popular CSS framework that makes it easy to create responsive and beautiful user interfaces. Let's explore its features together.",
        date: new Date().toLocaleDateString(),
        author: "Admin"
    }
];

// Routes
// Home page - show all blog posts
app.get('/', (req, res) => {
    res.render('index', { posts: blogPosts });
});

// Show individual blog post
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = blogPosts.find(post => post.id === postId);
    
    if (post) {
        res.render('show', { post: post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Show form to create new post
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// Create new blog post
app.post('/posts', (req, res) => {
    const newPost = {
        id: blogPosts.length + 1,
        title: req.body.title,
        content: req.sanitize(req.body.content),
        date: new Date().toLocaleDateString(),
        author: req.body.author || 'Anonymous'
    };
    
    blogPosts.push(newPost);
    res.redirect('/');
});

// Show form to edit existing post
app.get('/posts/:id/edit', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = blogPosts.find(post => post.id === postId);
    
    if (post) {
        res.render('edit', { post: post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Update existing blog post
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = blogPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
        blogPosts[postIndex] = {
            id: postId,
            title: req.body.title,
            content: req.sanitize(req.body.content),
            date: blogPosts[postIndex].date, // Keep original date
            author: req.body.author || blogPosts[postIndex].author
        };
        res.redirect('/posts/' + postId);
    } else {
        res.status(404).send('Post not found');
    }
});

// Delete blog post
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    blogPosts = blogPosts.filter(post => post.id !== postId);
    res.redirect('/');
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Blog server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view your blog`);
});
