const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('events',{
        ID:{
            type:Sequelize.UUID,
             primaryKey: true,
             allowNull:false
        
        },
        Creator_Name:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Created_For:{
           type:Sequelize.INTEGER,
             allowNull:false
        },
        Limit:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
        Exhibition_Type:{
            type:Sequelize.ENUM,
            values:["2D","3D"],
            allowNull:false
        },
        Title:{
        type:Sequelize.STRING,
        allowNull:false
        },
        Title_Slug:{
            type:Sequelize.STRING,
        },
        Event_Mini_Website_Data:{
            type:Sequelize.TEXT,
        },
        Event_Mini_Website_HTML:{
            type:Sequelize.TEXT,
        },
        Status:{
            type:Sequelize.ENUM,
            values:["Active","Deactive"],
            allowNull:false
        },
        Thumbnail_Link:{
            type:Sequelize.TEXT,
        },
        Category_ID:{
            type:Sequelize.INTEGER,
        },
        Category_Name:{
            type:Sequelize.STRING,
        },
        Website_Url:{
            type:Sequelize.STRING,
        },Created_At:{
            type:Sequelize.DATE,
        },Updated_At:{
            type:Sequelize.DATE,
        },Ending_At:{
            type:Sequelize.DATE,
        },SoftDelete:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Event_Refereal_Link:{
            type:Sequelize.TEXT
        },
      },{
        timestamps:false
    });

