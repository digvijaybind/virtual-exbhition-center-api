const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('org_exhibitor_bridges',{
    ID:{
        type:Sequelize.UUID,
        primaryKey: true,
        allowNull:false
        
    },
     Organizer_ID:{
            type:Sequelize.INTEGER
        },
        Exhibitor_ID:{
            type:Sequelize.INTEGER
        }, 
         Event_ID:{
            type:Sequelize.INTEGER
        },
        Status:{
            type:Sequelize.ENUM,
            values:["Active","Inactive"]
        },

         Created_At:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.NOW
        }, 
      },{
        timestamps:false
    });

