require("dotenv").config();
const express = require("express")
const app = express();
const path = require("path");
const port = process.env.PORT || 4000;
require("./db/conn");
const hbs = require("hbs");
const user = require("./models/register")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const staticPath = path.join(__dirname,"../public")
const templatesPath = path.join(__dirname,"../templates/views")
const partialPath = path.join(__dirname,"../templates/partials")
// console.log(staticPath) 

app.use(express.static(staticPath))
app.set("view engine","hbs");
app.set("views",templatesPath);
hbs.registerPartials(partialPath)

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get("/",(req,resp)=>{
    resp.render("index");
})
app.get("/register",(req,resp)=>{
    resp.render("register");
})

app.post("/register",async(req,resp)=>{
    try {
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        if(password === confirmpassword){
            // const hashPassword = await bcryptjs.hash(password,10);
            const registerUser = new user({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                age:req.body.age,
                gender:req.body.gender,
                password:password,
            })
            const token = await registerUser.generateAuthToken();
            const data = await registerUser.save();
            resp.status(201).render("index");
        }else{
            resp.send("Passwords are not matching")
        }
    } catch (error) {
       resp.status(400).send(error); 
    }
})

app.get("/about",(req,resp)=>{
    resp.render("about")
})
app.get("/login",(req,resp)=>{
    resp.render("login")
})

app.post("/login",async(req,resp)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userInfo = await user.findOne({email:email})
        const matchedPass = await bcryptjs.compare(password,userInfo.password)
        console.log(matchedPass)
        if(matchedPass==true){
            resp.status(201).render('index');
        }else{
            // alert("Password doesn't match")
            resp.send("ohoo galat info");
        }
        const token = await userInfo.generateAuthToken();
        console.log(token);

    } catch (error) {
        resp.status(400).send("invalid login info");
    }
   
})

app.listen(port,()=>{
    console.log("Listening on port "+ port)
})

