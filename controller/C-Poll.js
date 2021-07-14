
const Poll_Question=require('../model/Poll-Question');
const { roles } = require('../role')
const { v4: uuidv4 } = require('uuid');
const Poll_Answer=require('../model/Poll-Answer');
const User = require('../model/User');


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


exports.get_all_poll=(req,res)=>{


  //console.log(req.locals.user)  

  Poll_Question.findAll().then((result)=>{
    if(result){
      res.send(JSON.stringify({result}));
    }else{

      res.status(404).json({
        Message:"Cant Found Any Polls",
        Status:404,
        APICODE:'PA'
      })
    }

  }).catch(error=>{
    res.status(500).json({
      Message:'Internal Api Error',
      Status:500,
      APICODE:'PA'
  });
  })

}


exports.create_poll= async (req,res)=>{


  //send questtion with answer in a json array of json reach with forloop

  //ex   [   {question:"question"},{"option":"option1"},{"option":"option2"},{"option":"option3"}]


  const user=res.locals.user
    
  let question=req.body[0].Question;
  
  const data={
    
    ID:uuidv4(),
    Question:question,
    Exhibitor_ID:user.ID,
    Stall_ID:req.params.Stall_ID,
    Status:"Deactive"

  }


  const NewPoll=await Poll_Question.build(data);

  NewPoll.save().then((poll)=>{
    if(poll){
      for(let i=1;i<=req.body.length-1;i++){

        const optiondata={
          ID:uuidv4(),
          Poll_Question_ID:poll.ID,
          Answer:req.body[i].option
        }

  Poll_Answer.create(optiondata).then((option)=>{
        if(!option){
          res.status(409).json({
            Message:"Can't Add Options Right Now!",
            Status:409,
            APICODE:'PA'
          })
        }else{
        
          res.status(200).json({

            Message:"Successfully Created Poll With Options",
            Status:200,
            APICODE:'PA'

          })
        }
      }).catch(err=>{
            res.status(500).json({
                Message:"Internal Error",
                Status:500,
                APICODE:'PA'

            });
     })
  
    }

  }else{
      res.status(409).json({
        Message:"Cant Create New Poll Right Now",
        Staus:409,
        APICODE:'PA'

    });
    }

   }).catch(err=>{
    res.status(500).json({
        Message:'Internal Server  Error',
        Status:500,
        APICODE:'PA'
    });
})

}






//return a single poll with all the options


Poll_Question.hasMany(Poll_Answer,{
  foreignKey:'Poll_Question_ID',
  sourceKey:'ID'
})

exports.get_single_poll=async(req,res)=>{

  const ID=req.params.PollId;
//  Poll_Question.removeAttribute('ID');
  await Poll_Question.findByPk(ID ,{ include: [
{
  model:Poll_Answer
}

  ] }).then((result)=>{

    if(result){

      res.status(200).json({
        Message:"Data Found!",
        Status:200,
        APICODE:'PA',
        Data:result
      })

     
    }else{
      res.status(400).json({
        Message:"Some Error Has Occured!",
        Status:400,
        APICODE:'PA'
      })
    }

 
  }).catch(err=>{

    res.status(500).json({
      Message:'Internal Server Error',
      Status:500,
      APICODE:'PA',
      Error:JSON.stringify(err)
    })
  })




}

//delete entire poll with options for admin , exhbitor andorgnizer
exports.delete_single_poll=async(req,res)=>{











}


//delete single option




