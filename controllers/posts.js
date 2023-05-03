const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const auth = require('./../middlewares/auth');

const Post = require('./../models/posts');

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.getAll();
        res.render('posts/index', {
            posts: posts,
            message: req.flash('message')
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// CREATE
router.get('/posts/create', auth, (req, res) => {
    if (req.isAuthenticated) {
        const username = req.session.username;
        const data = {
            name: username,
            style: "color: red;",
            message: req.flash('message')
        }
        res.render('posts/create', data)
    } else {
        res.redirect('/login');
    }
})

router.post('/posts', async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const slug = slugify(title);
        const post = new Post({ title, slug, content })
        await post.create();

        res.redirect('/posts')

    } catch (err) {
        res.send(err)
    }
})

// READ
router.get('/posts/slug/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        const [post] = await Post.getBySlug(slug);

        // VG TODO
        // Get Comments

        res.render('posts/show', {
            post: post
        })
    } catch
    (err) {
        res.status(500).json({
            message: err.message
        });
    }
})



// Handle comments
const Comment = require('./../models/comments');

router.post('/posts/comments', async (req, res) => {
    console.log(req.body); // Lägg till detta för att se inkommande begärans kropp

    try {
        const slug = req.body.slug;
        const content = req.body.content;

        // Hämta posten baserat på slug
        const [post] = await Post.getBySlug(slug);

        // Skapa en ny kommentar och länka den till posten
        const comment = new Comment({ content, post_id: post.id });
        await comment.create();

        // Om allt går bra, omdirigera användaren tillbaka till posten
        res.redirect('/posts/slug/' + slug);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});



// Get a specific post
router.get('/posts:id', async (req, res) => {
  try {
    const post = await Post.getById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Update a post
// router.put('/posts:id', async (req, res) => {
//   try {
//     const post = await Post.getById(req.params.id);
//     post.title = req.body.title;
//     post.content = req.body.content;
//     await post.update();
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete a post
// router.delete('/posts:id', async (req, res) => {
//   try {
//     const post = await Post.getById(req.params.id);
//     await post.delete();
//     res.json({ message: 'Post deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
