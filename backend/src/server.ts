import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

const startServer = async () => {
  await connectDB();

  const PORT = ENV.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(` REVA ASSISTE Backend API Active on Port ${PORT}`);
    console.log(` Mode: ${ENV.NODE_ENV} | Model: ${ENV.GEMINI_MODEL}`);
    console.log(`======================================================`);
  });
};

startServer();
