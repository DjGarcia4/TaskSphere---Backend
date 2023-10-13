import mongoose from "mongoose";

const conDB = async () => {
  try {
    const conecction = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${conecction.connection.host}:${conecction.connection.port}`;
    console.log(`MongoDB connect to ${url}`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default conDB;
