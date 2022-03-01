import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var database;

database = mongoose.connection.once('connected', () => {
  console.log('MongoDB database connected');
});

export default database;
