"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      googleId: DataTypes.STRING,
      class: DataTypes.INTEGER,
      section: DataTypes.STRING,
      photo: DataTypes.TEXT,
      phone: DataTypes.STRING,
      points: DataTypes.INTEGER,
      lastMoveTime: DataTypes.DATE,
      email: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
      },
      disqualified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      exunite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Attempt);
    User.belongsTo(models.Level, { foreignKey: "currentLevelId" });
  };
  return User;
};
