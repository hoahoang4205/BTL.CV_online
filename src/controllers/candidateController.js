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

  const isEmail = identifier.includes('@');
 
  // Prepare the query based on the type of identifier
  const query = isEmail 
    ? "SELECT * FROM candidate WHERE email = ? AND password = ?" 
    : "SELECT * FROM candidate WHERE phone = ? AND password = ?";

  // Execute the query with the appropriate parameter
  const [rows] = await pool.query(query, [identifier, hashedPassword]);
  console.log(identifier,password,hashedPassword)
  if (rows.length > 0) {
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
    `, [candidate.id])

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
    const { email, fname, password } = req.body;
  
    try {
      const [existingcandidates] = await pool.query(
        "SELECT * FROM candidate WHERE email = ? AND full_name = ?",
        [email, fname]
      );
  
      if (existingcandidates.length > 0) {
        res.send("Account already exists");
      } else {
        await pool.query(
          "INSERT INTO candidate (email, full_name, password) VALUES (?, ?, ?)",
          [email, fname, password]
        );
  
        const [newCandidateRows] = await pool.query(
          "SELECT * FROM candidate WHERE email = ? AND full_name = ?",
          [email, fname]
        );
        if (newCandidateRows.length > 0) {
          const newCandidateId = newCandidateRows[0].id;
  
          // Thêm vào các bảng liên quan
          await pool.query("INSERT INTO candidate_achievement (candidate_id) VALUES (?)", [newCandidateId]);
          await pool.query("INSERT INTO candidate_company (candidate_id) VALUES (?)", [newCandidateId]);
          await pool.query("INSERT INTO candidate_education (candidate_id) VALUES (?)", [newCandidateId]);
          await pool.query("INSERT INTO candidate_experience (candidate_id) VALUES (?)", [newCandidateId]);
          await pool.query("INSERT INTO candidate_skill (candidate_id) VALUES (?)", [newCandidateId]);
          await pool.query("INSERT INTO candidate_social (candidate_id) VALUES (?)", [newCandidateId]);
          await pool.query("INSERT INTO skill_portfolio (candidate_id) VALUES (?)", [newCandidateId]);
  
          res.redirect(`/createinf?id=${newCandidateId}`);
          
        } else {
          res.status(500).send("Failed to retrieve new candidate ID");
        }
      }
    } catch (error) {
      res.status(500).send("Error creating candidate: " + error.message);
    }
  };
  
  export const infoCandidates = async (req, res) => {
    const { id } = req.query;  
    
    const { phone, first_name, age, language,address,position, short_goal, short_description,slogan,domain,map,
      skill_id, skill, skill_level,
      social_id, social_name, link_social ,
      education_id, specialization, education_level,education_short_description,education_start_time,education_end_time,
      company_id, company_name, company_contact,company_address,company_start_time,company_end_time,company_position,
      experience_id, experience, experience_short_description,
      achievement_id, achievement_name, achievement_count,
      portfolio_id,portfolio_image,portfolio_overlay_img 
    } = req.body;
  
      await pool.query("INSERT INTO skills (id, skill) VALUES (?, ?)", [skill_id, skill])
      await pool.query("INSERT INTO social (id, social_name) VALUES (?, ?)", [social_id, social_name])
      await pool.query("INSERT INTO educations (id, specialization) VALUES (?, ?)", [education_id, specialization])
      await pool.query("INSERT INTO company (id, name, contact, address) VALUES (?, ?, ?, ?)", [ company_id, company_name, company_contact,company_address])
      await pool.query("INSERT INTO experiences (id, experience) VALUES (?, ?)", [experience_id, experience])
      await pool.query("INSERT INTO achievements (id, name, count) VALUES (?, ?, ?)", [ achievement_id, achievement_name, achievement_count])
      await pool.query("INSERT INTO portfolio (id, image,overlay_img) VALUES (?, ?, ?)", [portfolio_id,portfolio_image,portfolio_overlay_img])
  
      await pool.query(
        "UPDATE candidate SET phone = ?, first_name = ?, age = ?, language = ?, address = ?, position = ?, short_goal = ?, short_description = ?, slogan = ?, domain = ?, map = ? WHERE id = ?",
        [phone, first_name, age, language, address, position, short_goal, short_description, slogan, domain, map, id]
      ); 

      await pool.query("UPDATE candidate_skill SET skill_id = ?, level = ? WHERE candidate_id = ?", [skill_id, skill_level, id]);
      await pool.query("UPDATE candidate_social SET social_id = ?, link = ? WHERE candidate_id = ?", [social_id, link_social, id]);
      await pool.query("UPDATE candidate_education SET education_id = ?, level = ?, start_time = ?, end_time = ?, short_description = ? WHERE candidate_id = ? ", [education_id,education_level,education_start_time,education_end_time,education_short_description, id]);
      await pool.query("UPDATE candidate_company SET company_id = ?, start_time = ?, end_time = ?, positon = ? WHERE candidate_id = ?", [company_id, company_start_time, company_end_time, company_position, id]);
      await pool.query("UPDATE candidate_experience SET experience_id = ?, short_description = ?,company_id = ?  WHERE candidate_id = ?", [experience_id, experience_short_description,company_id, id]);
      await pool.query("UPDATE candidate_achievement SET achievement_id = ? WHERE candidate_id = ?", [achievement_id, id]);
      await pool.query("UPDATE skill_portfolio SET portfolio_id = ?,skill_id = ?  WHERE candidate_id = ?", [portfolio_id,skill_id, id]);
  
      const [rows] = await pool.query('SELECT id, password FROM candidate');

      for (const row of rows) {
        const hashedPassword = createHash('md5').update(row.password).digest('hex');
        await pool.query('UPDATE candidate SET password = ? WHERE id = ?', [hashedPassword, row.id]);
      }
      
      console.log('Passwords have been hashed');
    
    
      res.redirect("/");

  };
      
      
