const express = require('express');
const router = express.Router();
const category = require('../models/categorymodel');

// Create a new category
router.post('/categories', async (req, res) => {
console.log(req.body)
try {
  const { name, description } = req.body;
  const newCategory = new category({ 
    name:req.body.categoryname, description:req.body.shortdescription });
    const savecate=await newCategory.save();
  
    if(savecate){
      res.json(newCategory);
    }else{
      res.status(404).json({message:"category not add"});
    }
} catch (error) {
  res.status(500).json({ error: 'Error creating a category' });
}

});

// Retrieve all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await category.find().sort({ _id: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Retrieve a single category by ID
router.get('/catespecific/:id', async (req, res) => {
  const id =  req.params.id;
  try {
    let getfiles= await category.findById(id);
    // if(getfiles){
      res.json(getfiles)
    // }else{
    //   res.json({result:"No data availible.."})
    // }
  } catch (error) {
    res.status(500).json({result:"Server error"})
  }
});

// Update a category by ID
router.put('/categories/:id', async (req, res) => {
  console.log(req.body);
  const id=req.params.id;
  // console.log(id);
  const filesave = await  category.findByIdAndUpdate(id,{
    name:req.body.title,
    description:req.body.description,
  });
       res.json(filesave)
});

// Delete a category by ID
router.delete('/categories/:categoryId', async (req, res) => {
  try {
    const categor = await category.findByIdAndRemove(req.params.categoryId);
    if(categor){
      res.status(301).json({result:category})}
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the category' });
  }
});

module.exports = router;
