import express from "express";
import router from "./routes/api";
import connectDB from "./utils/database";




async function init() {
  try {
    const result = await connectDB();
    console.log("Database connected", result);
    const app = express();
    const port = 3000;
    app.use(express.json());
    app.use("/api", router);
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
