const express = require('express');
const router = express.Router();
const { 
  getProperties, 
  getFeaturedProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty, 
  getSimilarProperties 
} = require('../controllers/property.controller');
const { checkAuth, checkAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);

// Protected routes
router.post('/', checkAuth, checkAdmin, createProperty);
router.put('/:id', checkAuth, checkAdmin, updateProperty);
router.delete('/:id', checkAuth, checkAdmin, deleteProperty);

module.exports = router; 