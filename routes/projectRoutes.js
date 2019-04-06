const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

//Get route => to get all projects 

router.get('/projects', (req, res, next) => {
    User.find({role: 'causa'}).populate()
    .then(allProjects => {
        res.json(allProjects);
    })
    .catch(err => {
        res.json(err)
    })
});


//Post route => to show a especific project

router.get('/projects/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(400).json({ message: 'Specified id is not valid' })
        return;
    }

    User.findById(req.params.id).populate()
    .then( response => {
        res.status(200).json(response)
    })
    .catch(err => {
        res.json(err)
    })
})


// PUT route => to edit the project

router.put('/projects/:id', (req, res, next )=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(400).json({message: 'id is not valid'})
        return;
    }

    User.findByIdAndUpdate(req.params.id, req.body)
    .then( () => {
        res.status(200).json({message: `Project with ${req. params.id} is updated successfully`})
    })
    .catch( err => {
        res.json(err)
    })
})

// Delete route => de remove a project

router.delete('/projects/:id', (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(400).json({message: 'Specified id is not valid'})
        return
    }

    User.findByIdAndRemove(req.params.id)
    .then(() => {
        res.json({message: `Project with id ${req.params.id} was removed successfully`})
    })
    .catch( err => {
        res.json(err)
    })
})

module.exports = router;