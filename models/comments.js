// models/comment.js
const db = require('./../db_connection');

class Comment {
    constructor({ content, post_id }) {
        this.content = content;
        this.post_id = post_id;
    }

    async create() {
        const sql = `
            INSERT INTO comments(content, post_id)
            VALUES(?, ?)
        `;

        const result = await db.query(sql, [this.content, this.post_id]);

        this.id = result.insertId;
        return this;
    }
}



module.exports = Comment;