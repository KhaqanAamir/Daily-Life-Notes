import mongoose from "mongoose";

const mongoURI="mongodb+srv://khaqanrough:khaqanrough@signupuser.8x3qyih.mongodb.net/" 

// const connectToMongo = () => {
//     mongoose.connect(mongoURI, () => {
//         console.log("connected to mongo successfully")
//     })
// }

const connectToMongo = () =>{
    mongoose.connect(mongoURI)
  .then(() => console.log('connected to mongo successfully'));
}

export default connectToMongo