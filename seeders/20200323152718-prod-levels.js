"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const levels = Array(20)
      .fill({})
      .map((_v, i) => {
        return {
          question: `test question ${i + 1}`,
          answer: `answer${i + 1}`,
          points: (i + 1) * 100,
          sourceHint: `source hint ${i + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

    return queryInterface.bulkInsert("Levels", levels);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Levels", {}, {});
  }
};
