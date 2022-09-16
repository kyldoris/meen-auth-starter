require("dotenv").config();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const db = mongoose.connection;
const express = require('express');
const recipesRouter = express.Router();


recipesRouter.post('/', (req, res) => {
    recipesRouter.create(req.body, async () => {
        await db.collection('bookList.recipes').insertOne(
        ) 
        })
    });
    module.exports = recipesRouter;