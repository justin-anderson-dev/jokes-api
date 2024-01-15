import { Sequelize, Model, DataTypes } from 'sequelize';

export const UserJokeMap = (sequelize: Sequelize) => {
  UserJoke.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      jokeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'jokes',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      tableName: 'user_jokes', // The name of the join table
      timestamps: false
    }
  );
};

export default class UserJoke extends Model {
  public userId!: number;
  public jokeId!: number;
}
