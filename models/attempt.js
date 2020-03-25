"use strict";
module.exports = (sequelize, DataTypes) => {
  const Attempt = sequelize.define(
    "Attempt",
    {
      attempt: DataTypes.STRING
    },
    {}
  );
  Attempt.associate = function(models) {
    Attempt.belongsTo(models.User, { foreignKey: "UserId" });
    Attempt.belongsTo(models.Level, { foreignKey: "LevelId" });
  };
  return Attempt;
};
