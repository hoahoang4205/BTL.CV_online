import { createPool } from "mysql2/promise";
import { createHash } from 'crypto';
export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "cv_information",
});

async function hashPasswords() {
  const [rows] = await pool.query('SELECT id, password FROM candidate');

  for (const row of rows) {
    const hashedPassword = createHash('md5').update(row.password).digest('hex');
    await pool.query('UPDATE candidate SET password = ? WHERE id = ?', [hashedPassword, row.id]);
  }
  
  console.log('Passwords have been hashed');
}

hashPasswords().catch(err => console.error(err));
export default pool; 