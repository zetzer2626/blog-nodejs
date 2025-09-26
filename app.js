const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();

// Import database configuration
const { pool, initializeDatabase } = require('./config/database');

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

// Database helper functions
const db = {
    // Get all posts
    async getAllPosts() {
        try {
            const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
            return result.rows.map(row => ({
                id: row.id,
                title: row.title,
                content: row.content,
                author: row.author,
                date: new Date(row.created_at).toLocaleDateString(),
                created_at: row.created_at,
                updated_at: row.updated_at
            }));
        } catch (error) {
            console.error('Error getting all posts:', error);
            throw error;
        }
    },

    // Get post by ID
    async getPostById(id) {
        try {
            const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            return {
                id: row.id,
                title: row.title,
                content: row.content,
                author: row.author,
                date: new Date(row.created_at).toLocaleDateString(),
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        } catch (error) {
            console.error('Error getting post by ID:', error);
            throw error;
        }
    },

    // Create new post
    async createPost(title, content, author) {
        try {
            const result = await pool.query(
                'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
                [title, content, author]
            );
            
            const row = result.rows[0];
            return {
                id: row.id,
                title: row.title,
                content: row.content,
                author: row.author,
                date: new Date(row.created_at).toLocaleDateString(),
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // Update post
    async updatePost(id, title, content, author) {
        try {
            const result = await pool.query(
                'UPDATE posts SET title = $1, content = $2, author = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
                [title, content, author, id]
            );
            
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            return {
                id: row.id,
                title: row.title,
                content: row.content,
                author: row.author,
                date: new Date(row.created_at).toLocaleDateString(),
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    },

    // Delete post
    async deletePost(id) {
        try {
            const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
};

// Routes
// Home page - show all blog posts
app.get('/', async (req, res) => {
    try {
        const posts = await db.getAllPosts();
        res.render('index', { posts: posts });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).render('error', { message: 'Error loading blog posts' });
    }
});

// Show individual blog post
app.get('/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await db.getPostById(postId);
        
        if (post) {
            res.render('show', { post: post });
        } else {
            res.status(404).render('error', { message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error loading post:', error);
        res.status(500).render('error', { message: 'Error loading post' });
    }
});

// Show form to create new post
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// Create new blog post
app.post('/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        
        if (!title || !content) {
            return res.status(400).render('error', { message: 'Title and content are required' });
        }
        
        const newPost = await db.createPost(
            title,
            req.sanitize(content),
            author || 'Anonymous'
        );
        
        res.redirect('/');
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).render('error', { message: 'Error creating post' });
    }
});

// Show form to edit existing post
app.get('/posts/:id/edit', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await db.getPostById(postId);
        
        if (post) {
            res.render('edit', { post: post });
        } else {
            res.status(404).render('error', { message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error loading edit form:', error);
        res.status(500).render('error', { message: 'Error loading edit form' });
    }
});

// Update existing blog post
app.put('/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, content, author } = req.body;
        
        if (!title || !content) {
            return res.status(400).render('error', { message: 'Title and content are required' });
        }
        
        const updatedPost = await db.updatePost(
            postId,
            title,
            req.sanitize(content),
            author
        );
        
        if (updatedPost) {
            res.redirect('/posts/' + postId);
        } else {
            res.status(404).render('error', { message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).render('error', { message: 'Error updating post' });
    }
});

// Delete blog post
app.delete('/posts/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const deleted = await db.deletePost(postId);
        
        if (deleted) {
            res.redirect('/');
        } else {
            res.status(404).render('error', { message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).render('error', { message: 'Error deleting post' });
    }
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();
        
        // Start server
        app.listen(PORT, () => {
            console.log('🚀 Blog server is running!');
            console.log(`📍 Port: ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`🗄️  Database: PostgreSQL (Railway)`);
            console.log('✨ Ready to serve your blog!');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
