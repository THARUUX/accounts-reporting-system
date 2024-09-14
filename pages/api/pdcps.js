import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE,
        });

        if (req.method === 'POST') {
            const {editId, bankName, total } = req.body;

            if (!bankName || total == null) {
                return res.status(400).json({ message: "Bank name and total required" });
            }

            if(editId){
                await connection.query('UPDATE pdcps SET bankName = ? , total = ? WHERE id = ?', [bankName, total, editId]);
    
                return res.status(201).json({ message: "Data inserted successfully!" });
            } else {
                await connection.query('INSERT INTO pdcps (bankName, total) VALUES (?, ?)', [bankName, total]);
    
                return res.status(201).json({ message: "Data inserted successfully!" });
            }


        } else if (req.method === 'GET') {
            const [rows] = await connection.query('SELECT * FROM pdcps');
            return res.status(200).json(rows);

        } else if (req.method === 'DELETE') {
            const { id } = req.query; 

            if (!id) {
                return res.status(400).json({ message: "ID is required for deletion" });
            }

            await connection.query('DELETE FROM pdcps WHERE id = ?', [id]);

            return res.status(200).json({ message: "Data deleted successfully!" });

        } else {
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

    } catch (error) {
        console.error('Error in connection:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
