const sequelize=require('../db/db');  //for database connection
const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package

module.exports=sequelize.define('polls_questions',{
  ID:{
      type:Sequelize.UUID,
      primaryKey: true
  },Question:{
    type:Sequelize.STRING,
    allowNull:false
  },
  Exhibitor_ID:{
  allowNull:false,
  type:Sequelize.STRING

},
Stall_ID:{
allowNull:false,
type:Sequelize.STRING
},
Created_At:{
type:Sequelize.TIME
},
Status:{
      type:Sequelize.ENUM,
      values:["Active","Deactive"]
  }
},{
  timestamps:false
});

