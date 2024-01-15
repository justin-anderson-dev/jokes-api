import { Sequelize, Model, ModelCtor, ModelStatic } from 'sequelize';

export function setupAssociations(sequelize: Sequelize) {
  const User = sequelize.models.User as ModelStatic<Model<any, any>>;
  const Joke = sequelize.models.Joke as ModelStatic<Model<any, any>>;

  User.belongsToMany(Joke, {
    through: 'UserJoke',
    foreignKey: 'userId',
    as: 'jokes'
  });

  Joke.belongsToMany(User, {
    through: 'UserJoke',
    foreignKey: 'jokeId',
    as: 'users'
  });
}
