export default function (sequelize: any, Sequelize: any) {
  const League = sequelize.define(
    'leagues',
    {
      leagueName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      boardOfDirectors: {
        type: Sequelize.JSON,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )
  // Defining Association
  // Association btw Leagues and Teams

  League.associate = function (models: any) {
    // Ensure that 'models' has a reference to the 'teams' model
    if (models.teams && models.teams.associate) {
      League.hasMany(models.teams, {
        onDelete: 'CASCADE', 
        foreignKey: 'leagueId',
      });
    }
  };

  return League
}
