/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Jappinderdeep Singh Student ID: 166128215 Date: 06/07/2023
 *
 *  Cyclic Web App URL: ________________________________________________________
 *
 *  GitHub Repository URL: ______________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");
const {
  initialize,
  getAllItems,
  addItem,
  getItemById,
  getItemsByCategory,
  getItemsByMinDate,
  getCategories,
} = require("./store-service.js");

const app = express();

// Using the 'public' folder as our static folder
app.use(express.static("public"));

// Configuring Cloudinary
cloudinary.config({
  cloud_name: "dn7a7tqxj",
  api_key: "732685373776917",
  api_secret: "xaI4CW7iAqe5gAe8UZxQlgLVZr4",
  secure: true,
});

// Variable without any disk storage
const upload = multer();

// Configuring the port
const HTTP_PORT = process.env.PORT || 3000;

//  Home Page Route 

// Redirect to the about page
app.get("/", (req, res) => {
  res.redirect("/about");
});

//  About Page Route 

// Serve the about.html file
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

//  Items Page Route 

// Get store items based on category or minimum date
app.get("/items", (req, res) => {
  // Checking if a category was provided
  if (req.query.category) {
    getItemsByCategory(req.query.category)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  // Checking if a minimum date is provided
  else if (req.query.minDate) {
    getItemsByMinDate(req.query.minDate)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  // Fetching all store items if no specification queries were provided
  else {
    getAllItems()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

//  Add Item Page Route (GET) 

// Serve the addItem.html file for adding a new item
app.get("/items/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addItem.html"));
});

//  Add Item Page Route (POST) 

// Handle the form submission for adding a new item
app.post("/items/add", upload.single("featureImage"), (req, res) => {
  // Configuring Cloudinary image uploading
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req)
      .then((uploaded) => {
        processItem(req, res, uploaded.url);
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    processItem(req, res, "");
  }
});

//  Find an item by ID Route 
// Get a specific item by its ID
app.get("/item/:value", (req, res) => {
  getItemById(req.params.value)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//  Categories Page Route 

// Get all store categories
app.get("/categories", (req, res) => {
  getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

//  HANDLE 404 REQUESTS 

// Handle requests for undefined routes (404 Not Found)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404error.html"));
});

//  Setup http server to listen on HTTP_PORT 

// Initialize the store service and start the server
initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize store service:", err);
  });

// Process the item data and add it to the store
function processItem(req, res, imageUrl) {
  req.body.featureImage = imageUrl;

  // Adding the item if everything is okay
  // Only add the item if the title is provided
  if (req.body.title) {
    const itemData = {
      body: req.body.body,
      title: req.body.title,
      postDate: Date.now(),
      category: req.body.category,
      featureImage: req.body.featureImage,
      published: req.body.published ? true : false,
    };

    addItem(itemData)
      .then(() => {
        res.redirect("/items");
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.redirect("/items");
  }
}
