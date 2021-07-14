const Event=require('../model/Event')
const User_Session=require('../model/User-Session')
const JWT=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const {roles}=require('../role')
const EventModel=require('../model/Event')
const UserModel=require('../model/User')
const OrgExhibitorLinkModel=require('../model/Org-Exhibitor')
const { where,Op } = require('sequelize')
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
  

//Admin



OrgExhibitorLinkModel.hasMany(Event, {
  foreignKey : 'ID',
  sourceKey: 'Event_ID'
});

OrgExhibitorLinkModel.hasMany(UserModel,{
  foreignKey:'ID',
  sourceKey:'Exhibitor_ID'
})












 


  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 




  exports.create_new_event=async (req,res,next)=>{

    const PAYMENT_SUCCESFUL=true;

    const nextWeek = new Date()

   const NewEvent=EventModel.build({
      ID:uuidv4(),
      Creator_Name:req.user.Full_Name,
      Created_For:req.user.ID,
      Limit:30,
      Exhibition_Type:"2D",
      Title:makeid(10),
      Status:PAYMENT_SUCCESFUL,
      Ending_At:nextWeek.setDate(new Date().getDate() + 7),
      SoftDelete:'false'
  
    })
    

    NewEvent.save().then((eventresult)=>{
      if(eventresult){

        let LINK=JWT.sign({
          ID:eventresult.ID,
          EID:eventresult.Created_For,
          Limit:eventresult.Limit,
          Type:eventresult.Exhibition_Type,
          Status:eventresult.Status

        },"rightpasswordisradiuspcfeb8", {
          expiresIn: "7d"  //30s
        });

        eventresult.update({
          Event_Refereal_Link:LINK
        })
    

        res.status(200).json({
          Message:eventresult
        })
      
      }else{
        res.status(400).json({
          Message:"No Event Created Contact Support"
        })
      }
    
    }).catch(error=>{

      res.status(500).json({
        message:error
    });


    })


  }




//list all Events only for admins 

exports.getallevents = async (req, res, next) => {

  let limit = 20;   // number of records per page
  let offset = 0;   //no offset
 await Event.findAndCountAll()
  .then((data) => {
    let page = req.params.Page || 1;      // number og page as param
    let pages = Math.ceil(data.count / limit);
        offset = limit * (page - 1);
Event.findAll(
    {order: [
      ['ID', 'DESC'],
  ],
  limit: limit,
  offset: offset,
  $sort: { id: 1 }
  })
    .then((events) => {
      res.status(200).json({'TotalEvents': data.count,"PerPage":limit,'Totalpages': pages, "CurrentPage":page ,'result': events});
    });
  })
  .catch(function (error) {
        res.status(500).json({message:error})
    });

}



//get details about any event only for admins 
exports.getanyeventdata=async (req,res,next)=>{
  
  const ID=req.params.EventId
  //OrgExhibitorLinkModel.removeAttribute('ID')
  OrgExhibitorLinkModel.findAll({
    include:[{
      model:EventModel,
      where:{ID:ID},
   
    },{
      model:UserModel
    }]
  }).then(results=>{
      if(!results){
        res.status(404).json({ Errror: 'data Doesnt Exist' })
      }else{
        res.status(200).json({
          results
        });
      }
    }).catch(err=>{
      res.status(500).json({
        message:err
    });
    })


}



//bridge exhibitor to event model 
exports.bridgedeventexhibitordata=(req,res,next)=>{

  const ID=req.params.EventId
 OrgExhibitorLinkModel.removeAttribute('ID')
  OrgExhibitorLinkModel.findAll({
    include:[{
      model:EventModel,
      where:{ID:ID},
    },{
      model:UserModel
    }]
  }).then(results=>{
      if(!results){
        res.status(404).json({ Errror: 'data Doesnt Exist' })
      }else{
        res.status(200).json({
          results
        });
      }
    }).catch(err=>{
      res.status(500).json({
        message:err
    });
    })

  }


//Only Admins Can Delete the Evenets

exports.DeleteEvent = async (req, res, next) => {

  const id=req.params.EventId;
  await Event.findByPk(id).then((result)=>{
    if(result){
      result.destroy();
      res.status(200).json({
       Message:'Event Deleted',
       EventId:id        
     });
    
    }else{
     
      res.status(404).json({
        Message:'Event Not Found'
      });

          }
  }).catch(err=>{
    res.status(500).json({
        Message:err
    });
})

}





//get lits of all events of  a single organizer for -organizer only 


exports.get_organizer_event_list=async(req,res,next)=>{

  const user = res.locals.user;
  const ID=user.ID
  await Event.findAll({
  
    where:{[Op.and]: [{ Created_For: ID }, { SoftDelete:'false' }]},
    attributes: { exclude: ['SoftDelete','Event_Refereal_Link','Event_Mini_Website_Data','Event_Mini_Website_HTML','Created_For'] }
  
  }).then((result)=>{
    if (result) {
      res.status(200).json({
        Message:'Data Found',
        result:result
      });
    } else {

      res.status(404).json({
        Error:'Event Not Found'
      });
    }
  }).catch(err => {
    res.status(500).json({
      Error: err
    });
  })
  
}




exports.get_organizer_single_event_datat=async(req,res,next)=>{











}




  exports.check_exhibitor_ref_link=async(req,res,next)=>{


    const TOKENID=req.params.tokenID;


    try{

      const { ID,EID,Limit,Type,Status,iat, exp }=await JWT.verify(TOKENID, "rightpasswordisradiuspcfeb8");

     const{count,rows}=await OrgExhibitorLinkModel.findAndCountAll({
       where:{Organizer_ID:EID}
     });



      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          Message: "JWT token has expired, please login to obtain a new one"
        });
    
      }
      else if(count<=30){
        
        return res.status(401).json({
          Message: "Cant Register , Registration is Full"
        });


      }
      else{

      return res.status(200).json({
            Message: "Ok! Move to Next Step",
            count:count,
            rows:rows
          });

      }
    }
    catch(error){
     res.status(401).json({
       Message:"Token Has malfunctioned ( Link Has Expired Cant Register to this form )"
     })
    }
  }





  //reg exhibitor from a link
  exports.reg_exb_link= async (req,res)=>{


    const RegToken=req.params.regtoken;

    
    await UserModel.findOne({ where: { Email: req.body.email } }).then(UserMail => {
      if (UserMail) {
        res.status(409).json({ Errror: 'Email Exist Use new Email' })
      } else {

        bcrypt.genSalt(Math.floor(Math.random() * (15 - 10)) + 10, function (err, salt) {
  
          if (err) {
            res.status(401).json({ Error: "Message  " + err })
          } else {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              // Store hash in your password DB.
  
              if (err) {
                res.status(502).json({ Error: "Message " + err })
              } else {
  
               const NewUser = UserModel.build({ 
                ID:uuidv4(),
                Full_Name:req.body.fullname, 
                Email:req.body.email , 
                Password:hash,
                PhoneNo:req.body.phno,
                Company_Name:req.body.compnay_name||"Tech Company",
                Role:"Visitor",
                Address:req.body.address,
                Country:req.body.country,
                Industry_Type:req.body.industry_type || "Worldwide Web",
                Designation:req.body.designation||"Sales"
  
    
              })
        
               const accessToken = JWT.sign({ID:NewUser.Email},"rightpasswordisradiuspcfeb8", {
                expiresIn: "1d"  //30s
              });
  
              NewUser.Access_Token=accessToken;
              
              NewUser.save().then((results)=>{


               if(results){
                const { ID,EID,Limit,Type,Status,iat, exp }=JWT.verify(RegToken, "rightpasswordisradiuspcfeb8");

          
            //create new data for organizer and exhibitor data trable 
            const NewOrgExhibtor =  OrgExhibitorLinkModel.build({ 
                Organizer_ID:EID,
                 Exhibitor_ID:results.ID,
                 Event_ID:ID,
                 Status:"Active"
            });

            NewOrgExhibtor.save().then((finalresult)=>{

              if(finalresult){

                res.status(200).json({
             org_exhibitor_bridge:finalresult,
              new_exhibitor_data:results,
                  linkdata_EventID:ID,
                  linkdata_Event_ID:EID,
                  linkdata_Event_Limit:Limit,
                  linkdata_Event_Type:Type
                  
                })

              }else{

                res.status(400).json({
                  Message:"Error"
                })

              }

            }).catch(err=>{
              res.status(500).json({
                Message:err
            });
            })
            
           
          }else{
                res.status(404).json({
                  Message:"ERROR"
                })
               }
              
               })
  
  
              }
  
            });
          }
        });
      }
    }).catch(err=>{
      Message:err
    })
  }

