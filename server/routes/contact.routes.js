const express = require('express');
const router = express.Router();
const { 
  submitContactForm, 
  getContactSubmissions, 
  getContactById, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contact.controller');
const { checkAuth, checkAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/', submitContactForm);

// Admin routes
router.get('/', checkAuth, checkAdmin, getContactSubmissions);
router.get('/:id', checkAuth, checkAdmin, getContactById);
router.put('/:id', checkAuth, checkAdmin, updateContactStatus);
router.delete('/:id', checkAuth, checkAdmin, deleteContact);

module.exports = router; 