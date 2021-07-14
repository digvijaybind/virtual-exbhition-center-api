const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('tempstalls',{
        ID:{
            type:Sequelize.UUID,
            primaryKey: true,
            allowNull:false
        },
     Name:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Banner_Img_Link:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Website_Link:{
            type:Sequelize.STRING,
            allowNull:false
        },

        Video_Link:{
            type:Sequelize.TEXT
        },
        Business_Card_Link:{
            type:Sequelize.TEXT
        },
        Description:{
            type:Sequelize.TEXT
        },
        Status:{
            type:Sequelize.ENUM,
            values:["Draft","Publish"],
            allowNull:false
        },
        Created_At:{
        type:Sequelize.DATE
        }  ,
        Created_For:{
            type:Sequelize.STRING,
            allowNull:false
            }
      },{
        timestamps:false
    });

