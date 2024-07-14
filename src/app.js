import express from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";


import customerRoutes from "./routes/candidate.routes.js";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/', (req, res) => {
    res.render('login');
});
// Route cho trang register
app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/createinf', (req, res) => {
    const { id } = req.query;  // Lấy newCandidateId từ query parameters
    res.render('createInformation', { newCandidateId: id });  // Truyền newCandidateId vào view
});
// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// routes
app.use(customerRoutes);
  
// static files
app.use(express.static(path.join(__dirname, "public")));

// starting the server
export default app;

//form

app.use(bodyParser.urlencoded({extended:true})); 