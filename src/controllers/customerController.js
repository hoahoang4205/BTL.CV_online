import { createHash } from 'crypto';
import { pool } from "../db.js";



export const renderCandidates = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM candidate");
  res.render("login", { candidates: rows });

};


export const checkLogin = async (req, res) => {
    const { identifier, password } = req.body;
    
    const hashedPassword = createHash('md5').update(password).digest('hex');

    // Determine if the identifier is an email or phone
    const isEmail = identifier.includes('@');

    // Prepare the query based on the type of identifier
    const query = isEmail 
      ? "SELECT * FROM candidate WHERE email = ? AND password = ?" 
      : "SELECT * FROM candidate WHERE phone = ? AND password = ?";

    // Execute the query with the appropriate parameter
    const [rows] = await pool.query(query, [identifier, hashedPassword]);
    console.log(identifier,password,hashedPassword)
    if (rows.length > 0) {
      res.render("home");
      
    } else {
      res.render("login");
    }
  }

export const createCandidates = async (req, res) => {
  const { password, address, phone } = req.body;

  // Kiểm tra xem khách hàng đã tồn tại chưa
  const [existingcandidates] = await pool.query(
    "SELECT * FROM candidate WHERE password = ? AND email = ? AND phone = ?",
    [password, address, phone]
  );

  if (existingcandidates.length > 0) {
    // Nếu đã tồn tại, trả về thông báo lỗi
    res.send("Account already exists");
  } else {
    // Nếu không tồn tại, thêm khách hàng mới vào cơ sở dữ liệu
    await pool.query("INSERT INTO candidate SET ?", [req.body]);
    res.redirect("/");
  }
};


export const editCandidate = async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query("SELECT * FROM candidate WHERE id = ?", [
    id,
  ]);
  res.render("candidates_edit", { candidate: result[0] });
};

export const updateCandidate = async (req, res) => {
  const { id } = req.params;
  const newcandidate = req.body;
  await pool.query("UPDATE candidate set ? WHERE id = ?", [newcandidate, id]);
  res.redirect("/");
};

export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM candidate WHERE id = ?", [id]);
  if (result.affectedRows === 1) {
    res.json({ message: "candidate deleted" });
  }
  res.redirect("/");
};



