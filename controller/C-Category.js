const Category=require('../model/Category');
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



//get all category
exports.get_all_category=(req,res)=>{
    Category.findAll().then((results)=>{
        if(!results){
            res.send('no results found')
            res.status(404).send();
        }else{
            res.send(JSON.stringify({results}));
          
        }
    }).catch(err=>{
        res.status(500).json({
            message:err
        });
    })
};





//get a single category

exports.get_single_category=(req,res,next)=>{
    
    const id=req.params.categoryID;  //get the products ID
    Category.findByPk(id).then((result) => {
        if(!result){
            res.status(500).json({
               id:id+" Doesnt exist ",
            });
        }else{
            res.send(JSON.stringify({result}));
        }
      }).catch(err=>{
        res.status(500).json({
            message:err
        });
    })



};



//update a category
exports.update_category=(req,res)=>{

    
    const id=req.params.categoryID;

  const data={

    Title:req.body.title,
    Description:req.body.description

  }
   
    Category.findByPk(id).then((category)=>{
        category.update(data).then((result)=>{
            res.status(200).json({
                message:result
            });
        })
    }).catch(err=>{
        res.status(500).json({
            message:err
        });
    });
}



//create a new Category
exports.create_category=(req,res)=>{

    function slugify(string) {
        return string
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
      }




    const data={
        ID:uuidv4(),
        Title:req.body.title,
        Description:req.body.description,
        Slug:req.body.slug || slugify(req.body.title),
        AuthorID:req.body.authorid,
        CreatedAt:new Date()
    };

    Category.create(data).then((results)=>{
        if(!results){
            res.send('No results found')
            res.status(404).send();
        }else{
            res.send(JSON.stringify({results}));
            /*res.status(200).json({
                message:'handling PSOT request for /post',
                createdPost:data
            }); */  
        }
      
    }).catch(err=>{
        res.status(500).json({
            message:err
        });
    })
 
};



//deleate a single Category
exports.deleate_single_category=(req,res)=>{


    const id=req.params.categoryID;  //get the category id
    Category.findByPk(id).then((category) => {
        if(!category){
            res.status(500).json({
               id:id+"Doesnt exist",
            });
        }
        else if(category.ID==1){
            res.status(500).json({
                Message:"cant Deleate Default Category",
             });
        }
        else{
            category.destroy();
             res.status(200).json({
                message:'Category deleted',
                id:id
        
            });
        }
      }).catch(err=>{
        res.status(500).json({
            message:err
        });
    })



}