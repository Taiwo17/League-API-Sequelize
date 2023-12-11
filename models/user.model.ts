export default function (sequelize: any, Sequelize: any) {
  const Users = sequelize.define(
    'users',
    {

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roles: {
        type: Sequelize.ENUM,
        values: ['user', 'admin', 'superAdmin'],
        defaultValue: 'user',
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )
  // Defining Association

   Users.associate = function (models: any) {
    // Ensure that 'models' has a reference to the 'teams' model
    if (models.users && models.users.associate) {
      Users.hasOne(models.tokens, {
        onDelete: 'CASCADE', 
        foreignKey: 'userId',
      });
    }
  }; 

  return Users
}
