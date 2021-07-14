const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('categories',{
        ID:{
            type:Sequelize.UUID,
            primaryKey: true,
            allowNull:false
        },
        Title:{
            type:Sequelize.STRING,
            unique:true
        },
        Slug:{
            type:Sequelize.TEXT,
            unique:true
        },
        Description:{
           type:Sequelize.STRING
        },
        AuthorID:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
        CreatedAt:{
        type:Sequelize.DATE
        }  
      },{
        timestamps:false
    });

