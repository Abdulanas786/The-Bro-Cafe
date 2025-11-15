import mongoose from 'mongoose';
export const dbConnect=async()=>{
    const conn= await mongoose.connect('mongodb://localhost:27017/The Bro Cafe');
    if(conn) {
        console.log("Db connected successfully..............");
    }
}