const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voto25', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB u lidh: ${conn.connection.host}`);
  } catch (error) {
    console.error('Gabim në lidhjen me MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;