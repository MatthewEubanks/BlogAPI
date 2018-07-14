const express = require("express");
const router = express.Router();

const {
    BlogPosts
} = require("./models");

// convenience function for generating lorem text for blog
// posts we initially add below
var loremIpsum = require('lorem-ipsum'),
    output = loremIpsum({
        count: 1 // Number of words, sentences, or paragraphs to generate.
            ,
        units: 'sentences' // Generate words, sentences, or paragraphs.
            ,
        sentenceLowerBound: 5 // Minimum words per sentence.
            ,
        sentenceUpperBound: 15 // Maximum words per sentence.
            ,
        paragraphLowerBound: 3 // Minimum sentences per paragraph.
            ,
        paragraphUpperBound: 7 // Maximum sentences per paragraph.
            ,
        format: 'plain' // Plain text or html
            ,
        random: Math.random // A PRNG function. Uses Math.random by default
    });

const author = "Matt Eubanks"
var bodyParser = require("body-parser");

// seed some posts so initial GET requests will return something
BlogPosts.create("10 things -- you won't believe #4", lorem(), "Billy Bob");
BlogPosts.create("Lions and tigers and bears oh my", lorem(), "Lefty Lil");

// add endpoint for GET. It should call `BlogPosts.get()`
// and return JSON objects of stored blog posts.
// send back JSON representation of all blog posts
// on GET requests to root
router.get("/", (req, res) => {
    res.json(BlogPosts.get());
});

// add endpoint for POST requests, which should cause a new
// blog post to be added (using `BlogPosts.create()`). It should
// return a JSON object representing the new post (including
// the id, which `BlogPosts` will create. This endpoint should
// send a 400 error if the post doesn't contain
// `title`, `content`, and `author`
router.post("/", (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ["title", "content", "author"];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(
        req.body.title,
        req.body.content,
        req.body.author
    );
    res.status(201).json(item);
});

// add endpoint for PUT requests to update blogposts. it should
// call `BlogPosts.update()` and return the updated post.
// it should also ensure that the id in the object representing
// the post matches the id of the path variable, and that the
// following required fields are in request body: `id`, `title`,
// `content`, `author`, `publishDate`
router.put("/:id", (req, res) => {
    const requiredFields = ["id", "title", "content", "author", "publishDate"];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${
      req.params.id
    }) and request body id `
        `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
});

// add endpoint for DELETE requests. These requests should
// have an id as a URL path variable and call
// `BlogPosts.delete()`
router.delete("/:id", (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post with id \`${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;