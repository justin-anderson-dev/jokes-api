import { Sequelize, Model, DataTypes } from 'sequelize';

export default class User extends Model {
  public id?: number;
  public username!: string;
  public password!: string;
}

export const UserMap = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false
    }
  );
  User.sync().then(() => {
    console.log('User table created');
  });
};
