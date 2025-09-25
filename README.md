# Blog Application

A simple and modern blog application built with Node.js, Express, and Bootstrap. This application demonstrates CRUD operations for blog posts with a beautiful, responsive user interface.

## Features

- ✅ **Create, Read, Update, Delete** blog posts
- ✅ **Responsive Design** using Bootstrap 5
- ✅ **Modern UI/UX** with smooth animations
- ✅ **Mobile-friendly** interface
- ✅ **Input Sanitization** for security
- ✅ **Beautiful Typography** and styling
- ✅ **Interactive Elements** with JavaScript

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Templating**: EJS (Embedded JavaScript)
- **Icons**: Bootstrap Icons
- **Security**: Express Sanitizer

## Installation

1. **Clone or download** this project to your local machine

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
blog-app/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── views/                # EJS templates
│   ├── partials/
│   │   ├── header.ejs    # Common header
│   │   └── footer.ejs    # Common footer
│   ├── index.ejs         # Home page
│   ├── show.ejs          # Individual post view
│   ├── new.ejs           # Create new post form
│   ├── edit.ejs          # Edit post form
│   ├── about.ejs         # About page
│   └── contact.ejs       # Contact page
└── public/               # Static files
    ├── css/
    │   └── style.css     # Custom styles
    └── js/
        └── main.js       # Custom JavaScript
```

## Usage

### Creating a New Post
1. Click on "New Post" in the navigation
2. Fill in the title, author, and content
3. Click "Publish Post"

### Editing a Post
1. Go to any blog post
2. Click the dropdown menu (three dots)
3. Select "Edit Post"
4. Make your changes
5. Click "Update Post"

### Deleting a Post
1. Go to any blog post
2. Click the dropdown menu (three dots)
3. Select "Delete Post"
4. Confirm the deletion

## API Routes

- `GET /` - Home page (list all posts)
- `GET /posts/new` - Show form to create new post
- `POST /posts` - Create new post
- `GET /posts/:id` - Show individual post
- `GET /posts/:id/edit` - Show form to edit post
- `PUT /posts/:id` - Update existing post
- `DELETE /posts/:id` - Delete post
- `GET /about` - About page
- `GET /contact` - Contact page

## Customization

### Adding New Features
- **Database Integration**: Replace the in-memory array with a database (MongoDB, PostgreSQL, etc.)
- **User Authentication**: Add login/register functionality
- **Comments System**: Implement comments for blog posts
- **Search Functionality**: Add search capabilities
- **Categories/Tags**: Organize posts by categories or tags
- **Image Upload**: Add image upload functionality

### Styling
- Modify `public/css/style.css` for custom styles
- Update Bootstrap classes in EJS templates
- Add your own color scheme and branding

### Functionality
- Extend `app.js` with new routes
- Add middleware for authentication, validation, etc.
- Implement additional features in `public/js/main.js`

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses `nodemon` to automatically restart the server when files change.

### Environment Variables
Create a `.env` file for environment-specific settings:
```
PORT=3000
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Check that port 3000 is available

## Future Enhancements

- [ ] Database integration
- [ ] User authentication
- [ ] Comments system
- [ ] Search functionality
- [ ] Image uploads
- [ ] Categories and tags
- [ ] RSS feed
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Social media integration

---

**Happy Blogging!** 🚀
