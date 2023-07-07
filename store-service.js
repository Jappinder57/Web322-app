/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Jappinderdeep Singh Student ID: 166128215 Date: 06/07/2023
 *
 *  Cyclic Web App URL: https://witty-teal-badger.cyclic.app/
 *
 *  GitHub Repository URL: https://github.com/Jappinder57/Web322-app-A3
 *
 ********************************************************************************/

const fs = require("fs");
const path = require("path");

let storeItems = [];
let storeCategories = [];

// Initializes the store service by reading data files
function initialize() {
  return new Promise((resolve, reject) => {
    // Read the store items file
    fs.readFile(
      path.join(__dirname, "data", "items.json"),
      "utf8",
      (err, itemData) => {
        if (err) {
          reject("Unable to read store items file");
        }

        // Parse the store items data
        storeItems = JSON.parse(itemData);

        // Read the store categories file
        fs.readFile(
          path.join(__dirname, "data", "categories.json"),
          "utf8",
          (err, categoryData) => {
            if (err) {
              reject("Unable to read store categories file");
            }
            // Parse the store categories data
            storeCategories = JSON.parse(categoryData);
            // Resolve the promise
            resolve();
          }
        );
      }
    );
  });
}

// Retrieves all store items
function getAllItems() {
  return new Promise((resolve, reject) => {
    if (storeItems.length === 0) {
      reject("No store items found");
    } else {
      resolve(storeItems);
    }
  });
}

// Retrieves all store categories
function getCategories() {
  return new Promise((resolve, reject) => {
    if (storeCategories.length === 0) {
      reject("No store categories found");
    } else {
      resolve(storeCategories);
    }
  });
}

// Retrieves published store items
function getPublishedItems() {
  return new Promise((resolve, reject) => {
    // Filter items by published status
    const publishedItems = storeItems.filter((item) => item.published === true);

    if (publishedItems.length > 0) {
      resolve(publishedItems);
    } else {
      reject("No published store items found");
    }
  });
}

// Retrieves store items by category
function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    // Filter items by category
    const itemsByCategory = storeItems.filter(
      (item) => item.category === category
    );

    if (itemsByCategory.length > 0) {
      resolve(itemsByCategory);
    } else {
      reject("No results returned");
    }
  });
}

// Retrieves store items by minimum date
function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    // Filter items by minimum date
    const itemsByMinDate = storeItems.filter(
      (item) => new Date(item.postDate) >= minDate
    );

    if (itemsByMinDate.length > 0) {
      resolve(itemsByMinDate);
    } else {
      reject("No results returned");
    }
  });
}

// Retrieves store item by ID
function getItemById(id) {
  return new Promise((resolve, reject) => {
    // Find item by ID
    const item = storeItems.find((item) => item.id === id);

    if (item) {
      resolve(item);
    } else {
      reject("No result returned");
    }
  });
}

// Adds a new store item
function addItem(itemData) {
  return new Promise((resolve, reject) => {
    if (!itemData) {
      reject("Invalid item data");
    } else {
      // Create a new item with an incremented ID
      const newItem = {
        ...itemData,
        id: storeItems.length + 1,
      };
      // Add the new item to the storeItems array
      storeItems.push(newItem);
      resolve(newItem);
    }
  });
}

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
};
