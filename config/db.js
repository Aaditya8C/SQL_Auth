const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sql12712950", "sql12712950", "7MTPmyYhnd", {
  host: "sql12.freemysqlhosting.net",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
