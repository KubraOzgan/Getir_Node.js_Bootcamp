const express = require("express");
const fileUpload = require('express-fileupload')
const { UserRoutes, ProductRoutes } = require("./routes");
const loaders = require("./loaders");
const config = require("./config");
const path = require("path");
const events = require("./scripts/events");

config();
loaders();
events();

const app = express();

app.use("/product-images", express.static(path.join(__dirname, "./", "uploads/products"))); 

app.use(express.json());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log(`Application is running on ${process.env.APP_PORT}`);
  app.use("/users", UserRoutes);
  app.use("/products", ProductRoutes);
});
