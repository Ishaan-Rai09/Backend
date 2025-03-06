const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Properties endpoints
router.get('/properties', (req, res) => {
  try {
    // Get query parameters
    const { type, location, minPrice, maxPrice } = req.query;
    
    // Mock properties data
    const properties = [
      {
        id: 1,
        title: 'Luxury Villa',
        location: 'Beverly Hills',
        price: 5000000,
        type: 'Villa'
      },
      {
        id: 2,
        title: 'Modern Penthouse',
        location: 'Manhattan',
        price: 8000000,
        type: 'Penthouse'
      }
    ];
    
    // Filter properties based on query parameters
    let filteredProperties = [...properties];
    
    if (type) {
      filteredProperties = filteredProperties.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    
    if (location) {
      filteredProperties = filteredProperties.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    
    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= parseInt(maxPrice));
    }
    
    res.status(200).json({
      success: true,
      count: filteredProperties.length,
      data: filteredProperties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

router.get('/properties/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock property data
    const property = {
      id: parseInt(id),
      title: 'Luxury Villa',
      location: 'Beverly Hills',
      price: 5000000,
      type: 'Villa',
      description: 'Beautiful luxury villa with ocean view',
      features: [
        '5 Bedrooms',
        '6 Bathrooms',
        'Swimming Pool',
        'Garden'
      ],
      images: [
        '/images/Luxury Villa in Beverly Hills.jpeg',
        '/images/Modern Family Home.jpeg'
      ]
    };
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Contact form endpoint
router.post('/contact', (req, res) => {
  try {
    const { name, email, message, subject, phone } = req.body;
    
    // Validate request body
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email and message'
      });
    }
    
    // Mock saving contact message
    const contactMessage = {
      id: Date.now(),
      name,
      email,
      message,
      subject: subject || 'General Inquiry',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };
    
    console.log('Contact form submission:', contactMessage);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contactMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router; 