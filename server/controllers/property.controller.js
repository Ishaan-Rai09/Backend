const Property = require('../models/property.model');

/**
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  Public
 */
const getProperties = async (req, res) => {
  try {
    const pageSize = 9;
    const page = Number(req.query.page) || 1;

    // Build filter object
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    } else if (req.query.minPrice) {
      filter.price = { $gte: req.query.minPrice };
    } else if (req.query.maxPrice) {
      filter.price = { $lte: req.query.maxPrice };
    }
    
    if (req.query.bedrooms) {
      filter['features.bedrooms'] = { $gte: req.query.bedrooms };
    }
    
    if (req.query.bathrooms) {
      filter['features.bathrooms'] = { $gte: req.query.bathrooms };
    }
    
    if (req.query.location) {
      filter.$or = [
        { 'location.city': { $regex: req.query.location, $options: 'i' } },
        { 'location.state': { $regex: req.query.location, $options: 'i' } },
        { 'location.address': { $regex: req.query.location, $options: 'i' } }
      ];
    }
    
    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    const count = await Property.countDocuments(filter);
    
    const properties = await Property.find(filter)
      .populate('agent', 'name email')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      properties,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  Public
 */
const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true })
      .populate('agent', 'name email')
      .limit(6);

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone');

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Create a property
 * @route   POST /api/properties
 * @access  Private/Admin
 */
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      status,
      type,
      location,
      features,
      images,
      mainImage,
      isFeatured
    } = req.body;

    const property = new Property({
      title,
      description,
      price,
      status,
      type,
      location,
      features,
      images,
      mainImage,
      agent: req.user._id,
      isFeatured: isFeatured || false
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update a property
 * @route   PUT /api/properties/:id
 * @access  Private/Admin
 */
const updateProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      status,
      type,
      location,
      features,
      images,
      mainImage,
      isFeatured
    } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
      property.title = title || property.title;
      property.description = description || property.description;
      property.price = price || property.price;
      property.status = status || property.status;
      property.type = type || property.type;
      property.location = location || property.location;
      property.features = features || property.features;
      property.images = images || property.images;
      property.mainImage = mainImage || property.mainImage;
      property.isFeatured = isFeatured !== undefined ? isFeatured : property.isFeatured;

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private/Admin
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      await property.remove();
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get similar properties
 * @route   GET /api/properties/:id/similar
 * @access  Public
 */
const getSimilarProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      type: property.type,
      'location.city': property.location.city,
      status: property.status
    })
      .limit(3)
      .populate('agent', 'name email');

    res.json(similarProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getSimilarProperties
}; 