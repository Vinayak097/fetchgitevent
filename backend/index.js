import express from 'express'
import { inputSchema } from './type.js';
import dotenv from 'dotenv'

import axios from 'axios'
import cors from 'cors'
// import {emailjs} from 'emailjs'
const app =express();
import emailjs from "@emailjs/nodejs";
import { generateToken } from './genreatToken.js';


const service_id = process.env.EMAILJS_SERVICE_ID;
const template_id = process.env.EMAILJS_TEMPLATE_ID;
const public_key = process.env.EMAILJS_PUBLIC_KEY;

import { createClient } from '@supabase/supabase-js';
import authMiddleware from './middleware.js';


emailjs.init({
  publicKey: public_key,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});
app.use(cors());
app.use(express.json());
dotenv.config()

console.log(process.env.SUPABASE_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function sendEmail(email,updates) {
  try {
    const response = await emailjs.send(service_id, template_id, {
      email: email,
      message: updates,
      to_name:email.split('@')[0],
      from_name:`"GitHub Updates" <${process.env.EMAIL_USER}>`
    });
  
    console.log("email sended" ,response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
app.post('/signup', async(req,res)=>{
    const {success,data,error}=inputSchema.safeParse(req.body)
    console.log(data , error)
    try{
        if(!success){
        res.json({message:"invalid input "})
    }
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", data.email)
      .single();
    if(!existingUser){
      const { error: supabaseError } = await supabase
      .from("users") // make sure you have a "users" table
      .insert([{ email: data.email }]);
      if (supabaseError) {
      console.error("Supabase insert error:", supabaseError.message);
      return res.status(500).json({ message: "Database insert failed" });
    }

    }
      
    

    
    const token =generateToken(data.email)
    res.status(200).json({
        message:"success",
        email:data.email,
        token
    })
    }catch(e){
        console.log(e)
        res.status(500).json({message:"Internal server error "})
    }    
})

app.post("/send-update", async (req, res) => {
  const {success,data:body}=inputSchema.safeParse(req.body)
  console.log(body)
  
        if(!success){
        res.json({message:"invalid input "})
    }
  const { data } = await axios.get("https://api.github.com/events");
  const updates = data.slice(0, 3).map(ev => `Repo: ${ev.repo.name}, Type: ${ev.type}`).join("\n");
  await sendEmail(body.email,updates);

  res.json({ message: "Update sent!" , updates});
});

app.listen(3000,()=>console.log("server running"))