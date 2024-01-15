import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import Joke from './joke';

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

export interface UserAttributes {
  id?: number;
  username: string;
  password: string;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {
  getJokes: () => Promise<Joke[]>;
}
export default class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;

  public getJokes!: () => Promise<Joke[]>;

  public static associations: {
    jokes: Association<User, Joke>;
  };
}
