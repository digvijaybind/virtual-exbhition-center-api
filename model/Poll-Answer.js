const sequelize=require('../db/db');  //for database connection
const Sequelize=require('sequelize'); //definifn constant and datatype from the sequelize package

module.exports=sequelize.define('poll_answers',{
  ID:{
      type:Sequelize.UUID,
      primaryKey: true
  },
  Poll_Question_ID:{
  allowNull:false,
  type:Sequelize.STRING

},
Answer:{
allowNull:false,
type:Sequelize.TEXT
},
Created_At:{
type:Sequelize.DATE
},
Updated_At:{
type:Sequelize.DATE
}
},{
  timestamps:false
});

