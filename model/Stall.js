const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('stalls',{
        ID:{
            type:Sequelize.UUID,
            primaryKey: true,
            allowNull:false
        },
        Exhibitor_ID:{
            type:Sequelize.UUID,
            allowNull:false
        },
        Event_ID:{
            type:Sequelize.UUID,
            allowNull:false
        },
        Title:{
           type:Sequelize.STRING,
           allowNull:false
        },
        Website_Link:{
            type:Sequelize.TEXT
        },

        Video_Wall:{
            type:Sequelize.TEXT
        },
        Poster_1:{
            type:Sequelize.TEXT
        },Poster_2:{
            type:Sequelize.TEXT
        },Front_Face:{
            type:Sequelize.TEXT
        },Business_Card:{
            type:Sequelize.TEXT
        },
        Created_At:{
        type:Sequelize.DATE
        }  
      },{
        timestamps:false
    });

