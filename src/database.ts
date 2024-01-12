import { Sequelize, Model, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

//TODO: move db credentials to .env file
// const database: string = process.env.DB_NAME;
// const user: String = process.env.DB_USER;
// const password: String = process.env.DB_PASSWORD;

const sequelize = new Sequelize('jokes-api-db', 'postgres', 'superuserp@ss', {
  host: 'localhost',
  dialect: 'postgres'
});

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    tableName: 'users',
    sequelize
  }
);

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

// User.create({
//   username: 'john@noemail.com',
//   password: '123456'
// }).then((user) => {
//   console.log('Created user:', user.username);
// });
