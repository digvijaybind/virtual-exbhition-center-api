const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('user_auth',{
        ID:{
            type:Sequelize.INTEGER,
            autonIncrement:true,
            primaryKey: true,
            autoIncrement:true
        },
        User_Id:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Logged_Out_At:{
           type:Sequelize.DATE,
         
        },
        Logged_In_At:{
            type:Sequelize.DATE,
           
        },
        Ip_Address:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Token_Secret:{
        type:Sequelize.TEXT,
        allowNull:false
        },
        Device:{
            type:Sequelize.STRING,
            allowNull:false
        },
      },{
        timestamps:false
    });

