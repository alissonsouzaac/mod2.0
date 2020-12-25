import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose
    .connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(result => {
      console.log('MongoDB Conectado');
    })
    .catch(error => {
      console.log('Error ao conectar ao MongoDB');
      console.log(error);
    });
  }
}

export default new Database();
