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

      const {editId, accountType, bankName } = req.body;

      if (!accountType || bankName == null) {
        return res.status(400).json({ message: 'Account type and bank name are required' });
      }

      //console.log('edit', editId);

      if (editId){
        await connection.query('UPDATE banks SET accountType = ? , bankName = ? WHERE id = ?', [accountType, bankName, editId]);
        res.status(201).json({ message: 'Data inserted successfully' });  
      } else {
        await connection.query('INSERT INTO banks (accountType, bankName) VALUES (?, ?)', [accountType, bankName]);
        res.status(201).json({ message: 'Data inserted successfully' });
      }

    } else if (req.method === 'DELETE'){
      const { id } = req.query;
      
      if (id){
        await connection.query('DELETE from banks WHERE id = ? ', [id]);
        res.status(201).json({ message: 'Data deleted successfully' });  
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
