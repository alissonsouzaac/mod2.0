import Sequelize, { Model } from 'Sequelize';

class File extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRUTAL,
        get() {
          return `${process.env.APP_URL}/files/${this.path}`;
        }
      }

    }, {
      sequelize,

     }
    );


    return this;
  }


}

export default File;
