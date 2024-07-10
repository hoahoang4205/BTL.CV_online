import { createHash } from 'crypto';
import { pool } from "../db.js";
import { query } from 'express';



export const renderCandidates = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM candidate");
  res.render("login", { candidates: rows });

};


export const checkLogin = async (req, res) => {
  const { identifier, password } = req.body;
  
  const hashedPassword = createHash('md5').update(password).digest('hex');
  
  async function hashPasswords() {
    const [rows] = await pool.query('SELECT id, password FROM candidate');
  
    for (const row of rows) {
      const hashedPassword = createHash('md5').update(row.password).digest('hex');
      await pool.query('UPDATE candidate SET password = ? WHERE id = ?', [hashedPassword, row.id]);
    }
  }
  
  hashPasswords().catch(err => console.error(err));
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
    await pool.query('UPDATE candidate SET password = ? WHERE id = ?', [password, rows.id]);
    const candidate = rows[0];

    // Fetch skills and candidate-skill data
    const [candidateSkills] = await pool.query(`
      SELECT cs.level, s.skill
      FROM candidate_skill cs
      JOIN skills s ON cs.skill_id = s.id
      WHERE cs.candidate_id = ?
    `, [candidate.id]);


    const [candidateEducation] = await pool.query(`
      SELECT cd.start_time , cd.end_time,  cd.level, cd.short_description , s.specialization
      FROM candidate_education cd
      JOIN educations s ON cd.education_id = s.id
      WHERE cd.candidate_id = ?
    `, [candidate.id]);


    const [candidateExperience] = await pool.query(`
      SELECT ce.short_description
      FROM candidate_experience ce
      JOIN experiences s ON ce.experience_id = s.id
      WHERE ce.candidate_id = ?
    `, [candidate.id]);

    const [candidateCompany] = await pool.query(`
      SELECT *
      FROM candidate_company cp
      JOIN company s ON cp.company_id = s.id
      JOIN candidate_experience i ON i.company_id = cp.company_id
      WHERE cp.candidate_id = ?
    `, [candidate.id]);

    const [skillPortfolio] = await pool.query(`
      SELECT sp.skill_id, sp.portfolio_id ,sp.candidate_id, s.id, p.id, p.image, p.overlay_img,s.skill
      FROM skill_portfolio sp
      JOIN skills s ON sp.skill_id = s.id
      JOIN portfolio p ON sp.portfolio_id = p.id
      WHERE sp.candidate_id = ?
    `, [candidate.id]);
    // Trong tệp JavaScript trước khi render EJS
    const uniqueSkills = skillPortfolio
    .map(skillportfolio => skillportfolio.skill)
    .filter((value, index, self) => self.indexOf(value) === index);

    const [candidateAchievement] = await pool.query(`
      SELECT *
      FROM candidate_achievement cp
      JOIN achievements s ON cp.achievement_id = s.id
      WHERE cp.candidate_id = ?
    `, [candidate.id]);


    const [candidateSocials] = await pool.query(`
      SELECT cs.link, s.social_name
      FROM candidate_social cs
      JOIN social s ON cs.social_id = s.id
      WHERE cs.candidate_id = ?
    `, [candidate.id]);

    // Pass all data to the template
    res.render("home", { candidate, candidateSkills,candidateEducation,candidateExperience,candidateCompany,skillPortfolio,uniqueSkills,candidateAchievement,candidateSocials});
      
    } else {
      res.render("login");
    }
  }


  export const createCustomers = async (req, res) => {
    const { fname, email, phone, message } = req.body;
    console.log(fname, email, phone, message)
    const [rows] = await pool.query(
          "INSERT INTO customer (full_name, email, phone, message) VALUES (?, ?, ?, ?)",
          [fname, email, phone, message])
          res.redirect('/');
          
    
      }

    
  export const createCandidates = async (req, res) => {
    const { phone, email, fname, password } = req.body;
    console.log( phone, email, fname, password)
    const [rows] = await pool.query(
          "INSERT INTO candidate (phone, email, full_name, password) VALUES (?, ?, ?, ?)",
          [ phone, email, fname, password])
          res.redirect('/');
          
    
      }


