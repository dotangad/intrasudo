const { Op } = require("sequelize");
const models = require("../models");

const levelNoMap = {};
async function levelNo(currentLevelId) {
  if (!levelNoMap[currentLevelId]) {
    levelNoMap[currentLevelId] = await models.Level.count({
      where: {
        id: {
          [Op.lte]: currentLevelId
        }
      }
    });
  }

  return levelNoMap[currentLevelId];
}

module.exports = levelNo;
