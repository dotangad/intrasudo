"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn("Users", "admin", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    queryInterface.addColumn("Users", "exunite", {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn("Users", "admin");
    queryInterface.removeColumn("Users", "exunite");
  }
};
