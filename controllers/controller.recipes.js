require("dotenv").config();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const db = mongoose.connection;
const express = require('express');
const recipesRouter = express.Router();
const Recipes = require('../models/recipes.js');

//INDUCE
//INDEX
recipesRouter.get('/', (req,res) => {
  Recipes.find({}, (err, foundRecipes) => {
      res.render('recipes/index.ejs', {
          recipes: foundRecipes
      })
  })
})

//DELETE
//D
recipesRouter.delete('/:id', (req, res) => {
  Recipes.findByIdAndRemove(req.params.id, () => {
      res.redirect('/recipes')
  })
})


//UPDATE
//U
recipesRouter.get('/:id/edit', (req, res) =>{
  Recipes.findById(req.params.id, (err, foundRecipes) => {
      res.render('recipes/edit.ejs', {
          recipes: foundRecipes
      })
  })
})

recipesRouter.put('/:id', (req, res) => {
  Recipes.findByIdAndUpdate(req.params.id, req.body,{new:true}, () => {
      res.redirect('/recipes')
  }) 
})

// ADD/CREATE/NEW
recipesRouter.post('/', (req, res) => {
    Recipes.create(req.body, async () => {
        // await db.collection('bookList.recipes').insertOne(
        // )
        res.redirect('/');

        })
    });

//SHOW
recipesRouter.get('/:id', (req, res) => {
  Recipes.findById(req.params.id, (err, foundRecipes) => {
      res.render('recipes/show.ejs',  {
          recipes: foundRecipes
      })
  })
})

module.exports = recipesRouter;