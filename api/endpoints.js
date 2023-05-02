const express = require('express');
const endpoints = express.Router();
const connection = require('./../db_connection');

const Post = require('./../models/posts');

//HÄMTAR ALLA POSTS
async function getTotalPosts() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as total_posts FROM posts';
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total_posts);
            }
        });
    });
}

//HÄMTAR HUR MÅNGA USERS
async function getAllUsers() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as total_users FROM users';
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total_users);
            }
        });
    });
}

endpoints.get('/api/getAllUsers', async (req, res) => {
    try {
        const totalUsers = await getAllUsers();
        res.json({
            total_users: totalUsers
        });
        console.log(totalUsers)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


endpoints.get('/api/getStats', async (req, res) => {
    try {
        const totalPosts = await getTotalPosts();
        res.json({
            total_posts: totalPosts
        });
        console.log(totalPosts)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

endpoints.get('/api/getAllPosts', async (req, res) => {
    try {
        const posts = await Post.getAll();
        res.json({
            posts: posts
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


module.exports = endpoints;


