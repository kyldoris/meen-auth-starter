require("dotenv").config();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const db = mongoose.connection;
const express = require('express');
const recipesRouter = express.Router();
const Recipes = require('../models/recipes.js');



recipesRouter.post('/', (req, res) => {
    Recipes.create(req.body, async () => {
        // await db.collection('bookList.recipes').insertOne(
        // )
        res.redirect('/');

        })
    });
    module.exports = recipesRouter;