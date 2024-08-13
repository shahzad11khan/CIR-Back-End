const express = require('express');
const router = express.Router();
const Nature = require('../models/naturemodel');


// Create a new nature resource
router.post('/natures', async (req, res) => {
  console.log(req.body)
try {
  const { name, description } = req.body;
  const newNature = new Nature({ 
    name:req.body.categoryname, description:req.body.shortdescription });
    const savecate=await newNature.save();
  
    if(savecate){
      res.status(201).json({status:201,newNature});
    }else{
      res.status(404).json({message:"Nature not add"});
    }
} catch (error) {
  res.status(500).json({ error: 'Error creating a category' });
}
});

// Retrieve all nature resources
router.get('/natures', async (req, res) => {
  try {
    const natures = await Nature.find().sort({ _id: -1 });
    res.json(natures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve nature resources' });
  }
});

// Retrieve a single nature resource by ID
router.get('/natures/:natureId', async (req, res) => {
  try {
    const nature = await Nature.findById(req.params.natureId);
    res.json(nature);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the nature resource' });
  }
});

// Update a nature resource by ID
router.put('/natures/:natureId', async (req, res) => {
  console.log(req.body);
  const id=req.params.natureId;
  console.log(id);
  const filesave = await  Nature.findByIdAndUpdate(id,{
    name:req.body.title,
    description:req.body.description,
  });
       res.json(filesave)
});

// Delete a nature resource by ID
router.delete('/natures/:natureId', async (req, res) => {
  try {
    const nature = await Nature.findByIdAndRemove(req.params.natureId);
    if (!nature) {
      return res.status(404).json({ error: 'Nature resource not found' });
    }
    res.json({ message: 'Nature resource deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the nature resource' });
  }
});

module.exports = router;
