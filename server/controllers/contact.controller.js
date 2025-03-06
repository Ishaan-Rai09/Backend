const Contact = require('../models/contact.model');

/**
 * @desc    Submit a contact form
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message, property } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      property
    });

    const createdContact = await contact.save();
    
    // In a real application, you would send an email notification here
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contact: createdContact
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Private/Admin
 */
const getContactSubmissions = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Contact.countDocuments();
    
    const contacts = await Contact.find({})
      .populate('property', 'title')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      contacts,
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
 * @desc    Get contact submission by ID
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('property', 'title mainImage');

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact submission not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update contact status
 * @route   PUT /api/contact/:id
 * @access  Private/Admin
 */
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.status = status || contact.status;

      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact submission not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a contact submission
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.remove();
      res.json({ message: 'Contact submission removed' });
    } else {
      res.status(404).json({ message: 'Contact submission not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitContactForm,
  getContactSubmissions,
  getContactById,
  updateContactStatus,
  deleteContact
}; 