import AppDataSource from "./data-source.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
//iife
(async () => {
  try {
    await AppDataSource.connect();
    console.log('database connection open to use');
    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  } catch (err) {
    console.log(err)
  }
})();
