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

    if (req.method === 'GET') {

        const { id } = req.query;

        if (id) {
            const [result] = await connection.query('SELECT * FROM banks WHERE id = ?', [id]);

            if (result.length > 0) {
            res.status(200).json(result);
            } else {
            res.status(404).json({ message: 'No data found for the given ID' });
            }
        } else {
            const [rows] = await connection.query('SELECT * FROM banks');
            res.status(200).json(rows);
        }

    } else if (req.method === 'POST') {
        const data = req.body;

        try {
        for (const row of data) {
            await connection.query('UPDATE banks SET accountBalance = ?, unrealizedCheques = ? WHERE id = ?', [row.amount1, row.amount2, row.id]);
        }
        res.status(200).json({ message: 'Data updated successfully' });
        } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error updating data' });
        }
      
    } else {

      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);

    }
  } catch (error) {

    console.error('Database error:', error);
    res.status(500).json({ message: 'Error handling request' });

  } finally {

    if (connection) {
      await connection.end(); // Close the connection
    }

  }
}
