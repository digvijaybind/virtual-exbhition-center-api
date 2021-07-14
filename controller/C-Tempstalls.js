
const Stall=require('../model/tempstall')
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






exports.get_all_sinlge_admin=async(req,res)=>{


    const ID=req.params.SID

    await Stall.findByPk(ID).then((stall)=>{
  
      if(stall){
  
        res.status(200).json({
          Message:"Single Stall",
          Status:200,
          APICODE:'Admin Any Stalls',
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



  
exports.delete_Any_stall = async (req, res, next) => {

    const SID=req.params.SID;
    await Stall.findByPk(SID).then((result)=>{
      if (result) { 
                result.destroy()
                res.status(200).json({
                  Message:"Stall Got Deleted",
                  Status:200,
                  APICODE:"Stall",
                })
      }
      else {
        res.status(404).json({
          Message:"Stall Not Found!",
          Status:404,
          APICODE:"Stall"
        })
      
      }
   
    }).catch(error => {
    
      res.status(500).json({
        Message:"Internal server Error",
        Status:500,
        Data:error,
        APICODE:"Stall"
      })
  })
  
}



//for admin and users 

exports.add_new_stall_admin=async(req,res,next)=>{


        const data={
          ID:uuidv4(),
          Name:req.body.Name,
          Banner_Img_Link:req.body.Banner_Img_Link,
          Video_Link:req.body.Video_Link,
          Business_Card_Link:req.body.Business_Card_Link,
          Website_Link:req.body.Website_Link,
          Created_For :req.body.Created_For,
          Status:req.body.Status,
          Description:req.body.Description
        

        
       
}


Stall.create(data).then((result)=>{

  if(result){
    res.status(200).json({
      Message:"Stall Got Created",
      Status:200,
      APICODE:"Stall",
    })
  }else{
    res.status(502).json({
      Message:"Can't Create Stall Right Now",
      Status:200,
      APICODE:"Stall",
    })
  }
}).catch(error => {
    
  res.status(500).json({
    Message:"Internal server Error",
    Status:500,
    Data:error,
    APICODE:"Stall"
  })
})


}



//public stalls


exports.get_all_stall_public=async(req,res)=>{
  await Stall.findAll({ where:{Status:"Publish"},
    attributes: {exclude: ['Created_For','Status','Created_At']}
  }
  ).then((stall)=>{
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


//get a single stall for public api



exports.get_single_stall_public=async(req,res)=>{


  const ID=req.params.SID

  await Stall.findByPk(ID,{where:{Status:"Publish"},   attributes: {exclude: ['Created_For','Status','Created_At']}}).then((stall)=>{

    if(stall){

      res.status(200).json({
        Message:"Single Stall",
        Status:200,
        APICODE:'Public Stall',
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

