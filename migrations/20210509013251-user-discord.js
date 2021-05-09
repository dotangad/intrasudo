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
      queryInterface.addColumn("Users", "discordId", Sequelize.STRING),
      queryInterface.addColumn("Users", "discordUsername", Sequelize.STRING),
      queryInterface.addColumn("Users", "discordEmail", Sequelize.STRING),
      queryInterface.addColumn(
        "Users",
        "discordDiscriminator",
        Sequelize.STRING
      ),
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
      queryInterface.removeColumn("Users", "discordId"),
      queryInterface.removeColumn("Users", "discordUsername"),
      queryInterface.removeColumn("Users", "discordEmail"),
      queryInterface.removeColumn("Users", "discordDiscriminator"),
    ]);
  },
};
