export default function (sequelize: any, Sequelize: any) {
    const Tokens = sequelize.define(
      'tokens',
      {
        token: {
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
    // Association btw Leagues and Teams
  
    Tokens.associate = function (models: any) {
      // Ensure that 'models' has a reference to the 'teams' model
      if (models.tokens && models.tokens.associate) {
        Tokens.belongsTo(models.users, {
          onDelete: 'CASCADE', 
          foreignKey: 'userId',
        });
      }
    };
   
    return Tokens
  }
  