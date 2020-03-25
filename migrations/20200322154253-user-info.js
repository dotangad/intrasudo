"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return Promise.all([
      queryInterface.addColumn("Users", "phone", Sequelize.STRING),
      queryInterface.addColumn("Users", "points", Sequelize.INTEGER),
      queryInterface.addColumn("Users", "lastMoveTime", Sequelize.DATE),
      queryInterface.addColumn("Users", "username", {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      }),
      queryInterface.addColumn("Users", "disqualified", {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn("Users", "phone"),
      queryInterface.removeColumn("Users", "points"),
      queryInterface.removeColumn("Users", "lastMoveTime"),
      queryInterface.removeColumn("Users", "disqualified")
    ]);
  }
};
