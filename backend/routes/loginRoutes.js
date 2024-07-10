import express from 'express'
import User from '../models/User.js'
import {body, validationResult} from 'express-validator'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import fetchuser from '../middlewares/fetchusers.js'

const loginRouter=express.Router()
const JWT_SECRET= "khaqansecret"


// this route is used to signup for the first time
loginRouter.post('/signup',[body('email').isEmail(), body('password').isLength({min: 4})] , async (req,res) => {

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    try{
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({error:'A user with this email already exists'})
    }
    const salt = bcrypt.genSaltSync(10);
    const secPassword= await bcrypt.hash(req.body.password,salt)

    user =await User.create({
        email:req.body.email,
        password:secPassword
    })
        const data={
            user:{
                id:user.id
            }
        }
        const jwtData=jwt.sign(data, JWT_SECRET)
        res.json({user})
}
catch(err){
    res.json({systemError:"It is a system error not query"})
}
})


// this route is used to login 
loginRouter.post('/login', [body('email').isEmail(), body('password','Password cannot be blank').exists()], async (req,res)=> {
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    const {email,password} = req.body
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Sorry user does not exists"})
        }
        const passwordCompare= await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({error:"Password error"})
        }
        const data= {
            user:{
                id:user.id
            }
        }
        const authToken= jwt.sign(data,JWT_SECRET)
        res.json({authToken})
    }
    catch(err){
        res.json({systemError:"It is a system error not query"})
    }
})

// Get details of already logged in user

loginRouter.post('/getdetails', fetchuser, async (req,res)=>{
    try{
       let userId= req.user.id
       const user= await User.findById(userId).select("-password")
       res.json(user)
    }
    catch(err){
        res.status(500).json({error:"Internal server error"})
    }
})

export default loginRouter