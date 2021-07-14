
const Stall=require('../model/Stall')
const { roles } = require('../role')
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




//get all stall data


exports.get_all_stall=async(req,res)=>{


  await Stall.findAll().then((stall)=>{

    if(stall){

      res.status(200).json({
        Message:"All Stalls",
        Status:200,
        APICODE:'Stalls',
        Data:stall

      })
    }else{

      res.status(404).json({
        Message:"No Stall Found",
        Status:404,
        APICODE:'Stalls'
      })
    }



  }).catch((err)=>{
    res.status(500).json({
      Message:'Internal Server Error',
      Status:500,
      APICODE:'Stalls',
      Error:err
    })
  })




}