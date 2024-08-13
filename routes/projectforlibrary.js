const express = require('express');
const router = express.Router();
const projectlibrary = require('../models/projectforlibrary');

// Create a new category
router.post('/projectlibrary', async (req, res) => {
console.log(req.body)
try {
  const { name, description } = req.body;
  const newpeoject = new projectlibrary({ 
    name:req.body.projectlib, description:req.body.description });
    const savecate=await newpeoject.save();
  
    if(savecate){
      res.json(newpeoject);
    }else{
      res.status(404).json({message:"category not add"});
    }
} catch (error) {
  res.status(500).json({ error: 'Error creating a category' });
}

});

// Retrieve all categories
router.get('/projectlibraries', async (req, res) => {
  try {
    const newpeoject = await projectlibrary.find().sort({ _id: -1 });
    res.json(newpeoject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Retrieve a single category by ID
router.get('/projectlibrary/:id', async (req, res) => {
  const id =  req.params.id;
  try {
    let getfiles= await projectlibrary.findById(id);
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
router.put('/projectlibrary/:id', async (req, res) => {
  console.log(req.body);
  const id=req.params.id;
  // console.log(id);
  const filesave = await  projectlibrary.findByIdAndUpdate(id,{
    name:req.body.title,
    description:req.body.shortdescription,
  });
       res.json(filesave)
});

// Delete a category by ID
router.delete('/projectlibrary/:categoryId', async (req, res) => {
  try {
    const newpeoject = await projectlibrary.findByIdAndRemove(req.params.categoryId);
    
    if(newpeoject){
      res.status(301).json({result:projectlibrary})}
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the category' });
  }
});

module.exports = router;
