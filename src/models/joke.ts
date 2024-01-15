import { Sequelize, Model, DataTypes } from 'sequelize';

export const JokeMap = (sequelize: Sequelize) => {
  Joke.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      joke: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'jokes',
      timestamps: false
    }
  );
};

export default class Joke extends Model {
  public id?: number;
  public joke!: string;
}
