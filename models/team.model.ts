export default function (sequelize: any, Sequelize: any) {
  const Teams = sequelize.define(
    'teams',
    {
      leagueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      teamName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coach: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )
  // Defining Association
  // Association btw Team and Players

  Teams.associate = function (models: any) {
    // Ensure that 'models' has a reference to the 'teams' model
    if (models.players && models.players.associate) {
      Teams.hasMany(models.players, {
        onDelete: 'CASCADE', // Correcting typo in 'cascade'
        foreignKey: 'teamId',
      })
    }
  }
  return Teams
}
