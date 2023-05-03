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

    static async getAllCommentsForPostBySlug(post_id) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT post_id, content FROM comments
            WHERE post_id = ?
          `;
            const values = [post_id]
            console.log("HÄR ÄR VALUES", values)
            
            db.query(sql, values, function (error, results, fields) {
                if (error) {
                    reject(error)
                } else {
                       
                        resolve(results)
                    

                    
                }
            });
        })
    }
    
}



module.exports = Comment