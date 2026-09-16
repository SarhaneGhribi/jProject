// database access layer for donations: recording a donation always also
// credits the target foundation's funds, so the two writes happen in one transaction
const conn = require("../db")

const createDonation = (userId, foundationId, amount, callback) => {
    conn.beginTransaction((err) => {
        if (err) return callback(err)

        conn.query(
            "insert into donations (user_id, foundation_id, amount) values (?, ?, ?)",
            [userId, foundationId, amount],
            (err, result) => {
                if (err) return conn.rollback(() => callback(err))

                conn.query(
                    "update foundations set funds = funds + ? where idfoundations = ?",
                    [amount, foundationId],
                    (err, updateResult) => {
                        if (err) return conn.rollback(() => callback(err))
                        if (updateResult.affectedRows === 0) {
                            return conn.rollback(() => callback(new Error("Foundation not found")))
                        }

                        conn.commit((err) => {
                            if (err) return conn.rollback(() => callback(err))
                            callback(null, { id: result.insertId })
                        })
                    }
                )
            }
        )
    })
}

const getDonationsByUser = (userId, callback) => {
    const sql = `select d.id, d.amount, d.created_at, f.idfoundations as foundationId, f.name as foundationName
                 from donations d
                 join foundations f on f.idfoundations = d.foundation_id
                 where d.user_id = ?
                 order by d.created_at desc`
    conn.query(sql, [userId], callback)
}

module.exports = { createDonation, getDonationsByUser }
