

const Sequelize=require('sequelize');

module.exports = new Sequelize('vep', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  
    pool: {
       max: 10000,
       min: 0,
      idle: 10000
    },

  });

