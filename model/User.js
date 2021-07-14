const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('users',{
        ID:{
            type:Sequelize.UUID,
            primaryKey: true,
            allowNull:false
      
        },
        Full_Name:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Email:{
           type:Sequelize.STRING,
           allowNull:false
        },
        Company_Name:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Address:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Password:{
            type:Sequelize.STRING,
            allowNull:false
        },
        PhoneNo:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
        Role:{
            type:Sequelize.ENUM,
            values:['Organizer','Exhibitor','Visitor'],
            allowNull:false
        },
        Access_Token:{
        type:Sequelize.TEXT,
        },
         Created_At:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.NOW
        }, 
      },{
        timestamps:false
    });

