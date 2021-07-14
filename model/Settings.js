const sequelize=require('../db/db');  //for database connection

const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package


 module.exports=sequelize.define('settings',{
        ID:{
            type:Sequelize.UUID,
            allowNull:false,
            primaryKey: true
           
        },
        SettingName:{
            type:Sequelize.STRING,
             allowNull:false

        },
        Value:{
            type:Sequelize.STRING,
             allowNull:false
        },
        SettingDescription:{
            type:Sequelize.STRING,
             allowNull:false
        },
        LoadAble:{
            type:Sequelize.ENUM,
            values:['Yes','No'],
            defaultValue:"No",
             allowNull:false,
        },
        UpdatedAt:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.Now
        }
    },{
        timestamps:false
    });
   
