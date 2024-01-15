import { Sequelize, Model, DataTypes } from 'sequelize';

export const UserMap = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(128),
        unique: true,
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
};

export default class User extends Model {
  public id?: number;
  public username!: string;
  public password!: string;
}
