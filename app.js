
const express = require("express");
const app = express();
const cors=require('cors');
const morgan=require('morgan');
const bodyparser=require('body-parser');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const user_session=require('./model/User-Session')


//import all the models here

const User=require('./model/User');


//end all the models here



//import all routers here
const EventRouter=require('./router/Event-Router')
const UserRouter=require('./router/User-Router');
const SettingRouter=require('./router/Settings-Router')
const CategoryRouter=require('./router/Category-Router');
const PollRouter=require('./router/Poll-Router')
const StallRouter=require('./router/Stall-Router')
const TempStallRouter=require('./router/Tempstall-Router')
//end all router here 

const { where } = require("./db/db");

app.use(bodyparser.json({limit: '5mb'}));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: true }));



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


//verfication
app.use(async (req,res,next)=>{

  if(req.headers["x-access-token"]){
  
    try{
      const useraccessToken= req.headers["x-access-token"];
      
      let tempid;
     await user_session.findOne({where:{Token_Secret:useraccessToken}}).then(sres=>{
    
        //console.log("session token",sres.Token_Secret)

        
        if(sres){
          const { ID, exp }=jwt.verify(sres.Token_Secret, "rightpasswordisradiuspcfeb8");
          
          tempid=ID;
          if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
              error: "JWT token has expired, please login to obtain a new one"
            });
          }

        }else{
          return res.status(404).json({
            error: "Not Found , Someone else must be using your account"
          });

        }

      })

      
      let result= await User.findByPk(tempid);
      result.save();
      res.locals.user=result.toJSON();
      next()


    }catch(error){
      next(error)
    }
  }else{
    next()
  }

})






app.use('/user',UserRouter);
app.use('/event',EventRouter);
app.use('/adminsettings',SettingRouter);
app.use('/category',CategoryRouter);
app.use('/poll',PollRouter);
app.use('/stall',StallRouter);
app.use('/tempstall',TempStallRouter)


module.exports = app;