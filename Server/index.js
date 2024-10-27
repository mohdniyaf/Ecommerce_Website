const express=require('express');
const connectDB=require('./Config/db');
const app=express();
const UserRoute=require('./ROUTER/user');
const adminRoute=require('./ROUTER/admin');
const cors = require('cors');


connectDB();

const corsOption = {
  origin:  `${process.env.FRONTEND_URL}`,
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};


app.use(express.json());
app.use(cors(corsOption));

app.get('/',(req,res)=>{
  res.send("server created");
});

app.use('/api/user',UserRoute);
app.use('/api/admin',adminRoute);

app.listen(3000,()=>{
    console.log("server is listening at port 3000");
    
})