'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const primaryKey = () => ({
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    })

    const timestamps = () => ({
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    const foreignKey = (table) => ({
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: table,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })

    await queryInterface.createTable('leagues', {
      id: primaryKey(),
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
      ...timestamps(),
    })

    await queryInterface.createTable('users', {
      id: primaryKey(),
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roles: {
        type: Sequelize.ENUM('user', 'admin', 'superAdmin'),
        allowNull: false,
        defaultValue: 'user',
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ...timestamps(),
    })

    await queryInterface.createTable('teams', {
      id: primaryKey(),
      leagueId: foreignKey('leagues'),
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
      ...timestamps(),
    })

    await queryInterface.createTable('players', {
      id: primaryKey(),
      teamId: foreignKey('teams'),
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
        allowNull: false,
        defaultValue: false,
      },
      ...timestamps(),
    })

    await queryInterface.createTable('tokens', {
      id: primaryKey(),
      userId: {
        ...foreignKey('users'),
        unique: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ...timestamps(),
    })
  },

  async down(queryInterface) {
    // Drop dependent tables before their parent tables.
    await queryInterface.dropTable('tokens')
    await queryInterface.dropTable('players')
    await queryInterface.dropTable('teams')
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('leagues')
  },
}
