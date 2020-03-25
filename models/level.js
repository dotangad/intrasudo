"use strict";
module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define(
    "Level",
    {
      question: DataTypes.STRING,
      answer: DataTypes.STRING,
      sourceHint: DataTypes.STRING,
      points: DataTypes.INTEGER
    },
    {}
  );
  Level.associate = function(models) {
    Level.hasMany(models.Attempt);
  };
  return Level;
};
