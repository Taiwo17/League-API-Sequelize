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
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )
  // Defining Association

  return Users
}
