require("dotenv").config();
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');


const app = express();
const userRoute = require('./Routes/user.route')



app.use(express.json());
app.use(cors({ origin: '*' }));


app.use("/api/back", userRoute);

const PORT = process.env.PORT || 8000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('DB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });



// Export the app for testing or further use
module.exports = app;
