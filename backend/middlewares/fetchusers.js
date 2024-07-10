import jwt from 'jsonwebtoken'


const JWT_SECRET= "khaqansecret"
const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token')
    if(!token){
        return res.status(401).send("Access Denied. Please authenticate using valid token")
    }
    try{
    const data=jwt.verify(token,JWT_SECRET)
    req.user=data.user
    next()
    }
    catch(err){
        return res.status(401).send("Access Denied.")
    }
}

export default fetchuser