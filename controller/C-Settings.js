const Settings=require('../model/Settings')



const {QueryTypes}=require('sequelize');
const sequelize=require('../db/db')
const { roles } = require('../role')


const Op = require('Sequelize').Op


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
  
  


  

exports.get_all_private_settings=async (req,res)=>{

  await Settings.findAll().then((result)=>{
      if(!result){
          res.status(404).json({
              Message:"Settings Not Found Something Wrong"
          })
      }else{
          res.send(JSON.stringify({result}));
      }
  }).catch(err=>{
      res.status(500).json({
          Message:err
      });
  })
  }
  






exports.updatesettings= async (req,res)=>{

 let settingname=[]
 let setttingvalue=[]
 let flag=false

for(x in req.body){
await Settings.update({Value:req.body[x]},{where:{SettingName:x}}).then((result)=>{
    if(!result){
      flag=false
      res.status(500).json({mes:"cant updated"})
    }else{
      flag=true
    }
}).catch(err=>{
  res.status(500).json({
      Message:err
  });
})

}
if(flag){res.status(200).json({mes:"updated"})}
}




exports.get_all_settings=async (req,res)=>{

  await Settings.findAll({
    where:{ LoadAble:"Yes"},
    attributes:{
        exclude:['CreatedAt','UpdatedAt','LoadAble',"SettingDescription"]
    }
  }).then((result)=>{
  
      if(!result){
          res.status(404).json({
              Message:"Settings Not Found Something Wrong"
          })
      }else{
          res.send(JSON.stringify({result}));
      }
  }).catch(err=>{
      res.status(500).json({
          Message:err
      });
  })
  }
  