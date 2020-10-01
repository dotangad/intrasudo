'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
       Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([queryInterface.addColumn("Users", "institution", Sequelize.STRING), queryInterface.addColumn("Users", "lastSolveTime", Sequelize.DATE), queryInterface.removeColumn("Users", "googleId"), queryInterface.removeColumn("Users", "class"), queryInterface.removeColumn("Users", "section"), queryInterface.removeColumn("Users", "photo"), queryInterface.removeColumn("Users", "phone")]);
  },
  down: function down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
       Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([queryInterface.removeColumn("Users", "institution"), queryInterface.removeColumn("Users", "lastSolveTime"), queryInterface.addColumn("Users", "googleId", Sequelize.STRING), queryInterface.addColumn("Users", "class", Sequelize.INTEGER), queryInterface.addColumn("Users", "section", Sequelize.STRING), queryInterface.addColumn("Users", "photo", Sequelize.STRING), queryInterface.addColumn("Users", "phone", Sequelize.STRING)]);
  }
};