export default function (sequelize: any, Sequelize: any) {
  const Players = sequelize.define(
    'players',
    {
      teamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      playerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      playerPosition: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isCaptain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )
  // Defining Association

  return Players
}
