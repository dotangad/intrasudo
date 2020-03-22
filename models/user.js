"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      googleId: DataTypes.STRING,
      class: DataTypes.INTEGER,
      section: DataTypes.STRING,
      photo: DataTypes.STRING,
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      exunite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
