const User = require('../model/User');
const user_session=require('../model/User-Session')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { roles } = require('../role');
const { v4: uuidv4 } = require('uuid');


exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.Role)[action](resource);
      console.log(permission);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
        data:user
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

exports.signup = async (req, res, next) => {
 
await User.findOne({ where: { Email: req.body.email } }).then(UserMail => {

    if (UserMail) {
      res.status(409).json({ Errror: 'Email Exist Use new Email' })
    } else {


      bcrypt.genSalt(Math.floor(Math.random() * (15 - 10)) + 10, function (err, salt) {

        if (err) {
        } else {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            // Store hash in your password DB.

            if (err) {
              res.status(502).json({ Error: "Message " + err })
            } else {

             const NewUser = User.build({ 
              ID:uuidv4(),
              Full_Name:req.body.Full_Name, 
              Email:req.body.email , 
              Password:hash,
              PhoneNo:req.body.phno,
              Company_Name:req.body.Company_Name,
              Role:"Exhibitor",
              Address:req.body.address+``+req.body.city+``+req.body.zip+``+req.body.state,
              

            

            
            
            })
      
             const accessToken = jwt.sign({ID:NewUser.Email},"rightpasswordisradiuspcfeb8", {
              expiresIn: "1d"  //30s
            });

            NewUser.Access_Token=accessToken;
            
             NewUser.save().then((results)=>{
               res.status(200).json({data:results});
             
             })


            }

          });
        }
      });
    }
  })
}


/*
exports.login =(req, res, next) => {

    const { email,password}=req.body;
   
   User.findOne({where:{Email:email}}).then((user)=>{
      if(!user){ res.status(200).json({Message:"Email Doesnt Exist"}) }
      bcrypt.compare(password,user.Password,(err,result)=>{
        if(!result){
           return res.status(401).json({ message:"Authentication is Failed" });}
        if(result){ 
         
         
         
          const accessToken = jwt.sign({ID:user.ID,Role:user.Role,Email:user.Email,Name:user.Name},"rightpasswordisradiuspcfeb8", {
            expiresIn: "1d"  //one minute fo test purpose
           });

          
          user_session.findOne({where:{User_Id:user.ID}}).then((authuser)=>{
            if(authuser){

              authuser.update({
                Token_Secret:accessToken
              })

              res.status(200).json({
                message:"update the token in the database",
                data:accessToken
                
              })   

            }else{
              user_session.create({
                ID:uuidv4(),
                User_Id:user.ID,
                Ip_Address:'137.0.0.1',
                Token_Secret:accessToken,
                Device:'Windows',
        
              }).then((sessionresult)=>{

                if(sessionresult){
                  res.status(200).json({
                    message:"authentication succesul",
                    data:sessionresult
                  })
                }else{
                  res.send(404)
                }

              })
            }
          })

        
        } 
      });
    }).catch(error=>{
      res.status(500).json({
          message:error
      });
  });

}
*/



//authozation



exports.login = (req, res, next) => {

  const { email,password}=req.body;
 
 User.findOne({where:{Email:email}}).then((user)=>{
    if(!user){ res.status(409).json({Message:"Email Doesnt Exist"}) }
    bcrypt.compare(password,user.Password,(err,result)=>{
      if(!result){
         return res.status(401).json({ message:"Authentication is Failed" });}
      if(result){ 
        const accessToken = jwt.sign({ID:user.ID,Role:user.Role,Email:user.Email,Full_Name:user.Full_Name},"rightpasswordisradiuspcfeb8", {
          expiresIn: "1d"  //one minute fo test purpose
         });
        user.Access_Token=accessToken;
        user.save().then((result)=>{
          res.status(200).json({
            message:"authentication success1",
            Status:200,
            APICODE:'USER',
            data:result
          })
        })
      
      }

    });
  }).catch(error=>{
    res.status(500).json({
        message:error
    });
});

}











// verify the auth token




exports.verify_user_token=async (req,res,next)=>{

  if(req.headers["x-access-token"]){
  
    try{
      const useraccessToken= req.headers["x-access-token"];
      
      let tempid;
     await user_session.findOne({where:{Token_Secret:useraccessToken}}).then(sres=>{

      if(sres){

          const { ID, exp }=jwt.verify(sres.Token_Secret, "rightpasswordisradiuspcfeb8");
          tempid=ID;
          if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
              error: "JWT token has expired, please login to obtain a new one"
            });
          }else{
            return res.status(200).json({
              Message: "Token is valid"
            });
          }

          
        }else{
          return res.status(404).json({
            error: "Not Found , Someone else must be using your account"
          });

        }

      })

 }catch(error){
      res.status(400)
    }
  }else{
    res.status(400)
  }

}



exports.getallusers = async (req, res, next) => {


  let limit = 10;   // number of records per page
  let offset = 0;   //no offset
 await User.findAndCountAll()
  .then((data) => {
    let page = req.params.Page || 1;      // number og page as param
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
  User.findAll(
   
    {order: [
      ['ID', 'DESC'],
  ],
  limit: limit,
   attributes: { exclude: ['Password','Access_Token'] },
  offset: offset,
  $sort: { id: 1 }
  })
    .then((users) => {
      res.status(200).json({'TotalPost': data.count,"PerPage":limit,'Totalpages': pages, "CurrentPage":page ,'result': users});
    });
  })
  .catch(function (error) {
        res.status(500).json({message:error})
    });

}





//getuser

exports.getUser = async (req, res, next) => {

  const id=req.params.UserId;

 await User.findByPk(id).then((result)=>{
    if (!result) {
      res.send('no results found')
      res.status(404).send();
    } else {
      res.send(JSON.stringify({ result }));
    }
  }).catch(err => {
    res.status(500).json({
      message: err
    });
  })

}

exports.updateUser = async (req, res, next) => {

}

exports.deleteUser = async (req, res, next) => {

  const id=req.params.UserId;
  await User.findByPk(id).then((result)=>{
    if(!result){
      res.send('No User Found')
      res.status(404).send();
    }else{
      result.destroy();
             res.status(200).json({
                message:'user Deleted',
                id:id
        
            });
          }
  }).catch(err=>{
    res.status(500).json({
        message:err
    });
})

}