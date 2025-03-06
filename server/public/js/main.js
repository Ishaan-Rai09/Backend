/**
 * LuxuryHomes - Main JavaScript File
 * This file contains all the JavaScript functionality for the LuxuryHomes website.
 * Authentication is handled entirely with localStorage (no backend database).
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize authentication
  initAuth();
  
  // Initialize property search
  initPropertySearch();
  
  // Initialize featured properties
  if (document.getElementById('featured-properties')) {
    loadFeaturedProperties();
  }
  
  // Initialize property details page
  if (document.querySelector('.property-gallery')) {
    initPropertyGallery();
  }
  
  // Initialize contact form
  if (document.getElementById('contact-form')) {
    initContactForm();
  }
  
  // Fix placeholder images
  fixPlaceholderImages();
  
  // Fix broken images
  fixBrokenImages();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const nav = document.querySelector('nav');
  const authLinks = document.querySelector('.auth-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
      if (authLinks) {
        authLinks.classList.toggle('active');
      }
    });
  }
}

/**
 * Initialize authentication functionality
 */
function initAuth() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (token && user) {
    // User is logged in
    updateUIForLoggedInUser(user);
  }
  
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      login(email, password);
    });
  }
  
  // Handle register form submission
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }
      
      register(name, email, password);
    });
  }
  
  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      logout();
    });
  }
}

/**
 * Login user using localStorage
 * @param {string} email - User email
 * @param {string} password - User password
 */
function login(email, password) {
  // Show loading state
  const submitBtn = document.querySelector('#login-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  }
  
  // Simulate network delay
  setTimeout(() => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find user with matching email
      const user = users.find(u => u.email === email);
      
      // Check if user exists and password matches
      if (!user) {
        throw new Error('User not found. Please register first.');
      }
      
      if (user.password !== password) {
        throw new Error('Invalid password. Please try again.');
      }
      
      // Create session token
      const token = 'token_' + Math.random().toString(36).substring(2, 15);
      
      // Save user data and token to localStorage (for session)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false
      }));
      
      console.log('Login successful:', user.name);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      showMessage('error', error.message);
      
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
      }
    }
  }, 1000);
}

/**
 * Register new user using localStorage
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 */
function register(name, email, password) {
  // Show loading state
  const submitBtn = document.querySelector('#register-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
  }
  
  // Simulate network delay
  setTimeout(() => {
    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        throw new Error('Email already registered. Please use a different email or login.');
      }
      
      // Create new user
      const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        password: password, // In a real app, this would be hashed
        isAdmin: false,
        createdAt: new Date().toISOString()
      };
      
      // Add user to users array
      users.push(newUser);
      
      // Save updated users array to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create session token
      const token = 'token_' + Math.random().toString(36).substring(2, 15);
      
      // Save user data and token to localStorage (for session)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }));
      
      console.log('Registration successful:', newUser);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('error', error.message);
      
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Register';
      }
    }
  }, 1000);
}

/**
 * Logout user
 */
function logout() {
  // Clear session data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to home page
  window.location.href = '/';
}

/**
 * Update UI for logged in user
 * @param {Object} user - User object
 */
function updateUIForLoggedInUser(user) {
  const authLinks = document.querySelector('.auth-links');
  const userProfile = document.querySelector('.user-profile');
  const userName = document.querySelector('.user-name');
  
  if (authLinks && userProfile && userName) {
    authLinks.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = user.name;
    
    // Add event listener for mobile dropdown toggle
    if (window.innerWidth < 768) {
      userProfile.addEventListener('click', function(e) {
        const dropdown = this.querySelector('.user-dropdown');
        if (dropdown) {
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
          e.stopPropagation();
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
          dropdown.style.display = 'none';
        }
      });
    }
  }
}

/**
 * Initialize property search functionality
 */
function initPropertySearch() {
  const searchForm = document.getElementById('property-search-form');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const location = document.querySelector('input[name="location"]').value;
      const status = document.querySelector('select[name="status"]').value;
      
      // Build query string
      let queryString = '';
      if (location) {
        queryString += `location=${encodeURIComponent(location)}`;
      }
      if (status) {
        queryString += queryString ? `&status=${encodeURIComponent(status)}` : `status=${encodeURIComponent(status)}`;
      }
      
      // Redirect to properties page with query string
      window.location.href = `/properties.html${queryString ? '?' + queryString : ''}`;
    });
  }
  
  // Handle filter form on properties page
  const filterForm = document.getElementById('property-filter-form');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(filterForm);
      const params = new URLSearchParams();
      
      for (const [key, value] of formData.entries()) {
        if (value) {
          params.append(key, value);
        }
      }
      
      // Redirect to properties page with query string
      window.location.href = `/properties.html?${params.toString()}`;
    });
    
    // Handle reset button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        window.location.href = '/properties.html';
      });
    }
    
    // Pre-fill filter form from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
      const input = filterForm.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = value;
      }
    }
  }
}

/**
 * Load featured properties from static data
 */
function loadFeaturedProperties() {
  const featuredPropertiesContainer = document.getElementById('featured-properties');
  if (!featuredPropertiesContainer) return;
  
  // Clear loading indicator
  featuredPropertiesContainer.innerHTML = '';
  
  // Sample property data (in a real app, this would come from an API)
  const properties = [
    {
      id: 'prop1',
      title: 'Luxury Villa in Beverly Hills',
      price: '$5,750,000',
      location: 'Beverly Hills, CA',
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      image: '/images/Luxury Villa in Beverly Hills.jpeg',
      status: 'For Sale'
    },
    {
      id: 'prop2',
      title: 'Penthouse in NYC',
      price: '$8,900,000',
      location: 'Manhattan, NY',
      bedrooms: 4,
      bathrooms: 4.5,
      area: 3800,
      image: '/images/Penthouse in NYC.jpg',
      status: 'For Sale'
    },
    {
      id: 'prop3',
      title: 'Beachfront Condo in Miami',
      price: '$3,200,000',
      location: 'Miami Beach, FL',
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      image: '/images/Beachfront Condo in Miami.jpeg',
      status: 'For Sale'
    },
    {
      id: 'prop4',
      title: 'Modern Apartment in Downtown',
      price: '$7,500/month',
      location: 'Downtown, NYC',
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      image: '/images/Modern Apartment in Downtown NYC.jpeg',
      status: 'For Rent'
    },
    {
      id: 'prop5',
      title: 'Suburban Home in Austin',
      price: '$1,250,000',
      location: 'Austin, TX',
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      image: '/images/Suburban Home in Austin.jpeg',
      status: 'For Sale'
    },
    {
      id: 'prop6',
      title: 'Mountain Retreat',
      price: '$2,800,000',
      location: 'Aspen, CO',
      bedrooms: 5,
      bathrooms: 4,
      area: 3600,
      image: '/images/Mountain Retreat.jpeg',
      status: 'For Sale'
    }
  ];
  
  // Display only 3 featured properties
  const featuredProperties = properties.slice(0, 3);
  
  // Create property cards
  featuredProperties.forEach(property => {
    const propertyCard = createPropertyCard(property);
    featuredPropertiesContainer.appendChild(propertyCard);
  });
}

/**
 * Create a property card element
 * @param {Object} property - Property data
 * @returns {HTMLElement} Property card element
 */
function createPropertyCard(property) {
  const card = document.createElement('div');
  card.className = 'property-card';
  
  card.innerHTML = `
    <div class="property-image">
      <img src="${property.image}" alt="${property.title}">
      <span class="property-status">${property.status}</span>
    </div>
    <div class="property-details">
      <h3 class="property-title">${property.title}</h3>
      <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
      <p class="property-price">${property.price}</p>
      <div class="property-features">
        <span class="property-feature"><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
        <span class="property-feature"><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
        <span class="property-feature"><i class="fas fa-ruler-combined"></i> ${property.area} sq ft</span>
      </div>
      <a href="/property-details.html?id=${property.id}" class="btn btn-primary">View Details</a>
    </div>
  `;
  
  return card;
}

/**
 * Initialize property gallery
 */
function initPropertyGallery() {
  const mainImage = document.querySelector('.main-image img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Update main image
        mainImage.src = this.querySelector('img').src;
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

/**
 * Initialize contact form
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Simulate form submission
      setTimeout(() => {
        try {
          // Get existing messages from localStorage
          const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
          
          // Add new message
          messages.push({
            id: 'msg_' + Date.now(),
            name,
            email,
            phone,
            subject,
            message,
            createdAt: new Date().toISOString(),
            status: 'new'
          });
          
          // Save to localStorage
          localStorage.setItem('contactMessages', JSON.stringify(messages));
          
          // Show success message
          showMessage('success', 'Your message has been sent successfully. We will contact you soon!');
          
          // Reset form
          contactForm.reset();
        } catch (error) {
          // Show error message
          showMessage('error', 'Failed to send message. Please try again.');
          console.error('Contact form error:', error);
        } finally {
          // Reset button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message';
        }
      }, 1500);
    });
  }
}

/**
 * Show message to user
 * @param {string} type - Message type (success or error)
 * @param {string} message - Message text
 */
function showMessage(type, message) {
  // Check if we're on a login or register page
  const isAuthPage = document.querySelector('.auth-section');
  
  if (isAuthPage) {
    // Use the auth-error container for login/register pages
    const authError = document.querySelector('.auth-error');
    if (authError) {
      authError.textContent = message;
      authError.style.display = 'block';
      
      // Hide message after 5 seconds
      setTimeout(() => {
        authError.style.display = 'none';
      }, 5000);
      return;
    }
  }
  
  // For other pages, use the standard form-message
  let messageContainer = document.querySelector('.form-message');
  
  // If no container exists, create one
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.className = 'form-message';
    
    // Insert after form or at the top of the page
    const form = document.querySelector('form');
    if (form) {
      form.parentNode.insertBefore(messageContainer, form.nextSibling);
    } else {
      document.body.insertBefore(messageContainer, document.body.firstChild);
    }
  }
  
  // Set message content and type
  messageContainer.textContent = message;
  messageContainer.className = `form-message ${type}`;
  messageContainer.style.display = 'block';
  
  // Hide message after 5 seconds
  setTimeout(() => {
    messageContainer.style.display = 'none';
  }, 5000);
}

/**
 * Fix placeholder images by replacing them with real images
 */
function fixPlaceholderImages() {
  // Fix hero background
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/Luxury Mansion.jpeg')";
  }
  
  // Fix about background
  const aboutHero = document.querySelector('.about-hero');
  if (aboutHero) {
    aboutHero.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/Modern Family Home.jpeg')";
  }
  
  // Fix properties background
  const propertiesHero = document.querySelector('.properties-hero');
  if (propertiesHero) {
    propertiesHero.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/Luxury City Apartment.jpeg')";
  }
  
  // Fix contact background
  const contactHero = document.querySelector('.contact-hero');
  if (contactHero) {
    contactHero.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/Beachside Villa.jpeg')";
  }
  
  // Fix auth images
  const authImages = document.querySelectorAll('.auth-image');
  if (authImages.length > 0) {
    authImages.forEach(img => {
      // Check if the image has a placeholder or missing background
      const currentBg = img.style.backgroundImage;
      if (!currentBg || currentBg.includes('hero-bg') || currentBg.includes('placeholder')) {
        // Set a random luxury home image
        const randomImage = getRandomPropertyImage();
        img.style.backgroundImage = `url('${randomImage}')`;
      }
    });
  }
  
  // Fix team member images
  const teamImages = document.querySelectorAll('.team-image img');
  if (teamImages.length > 0) {
    const teamPhotos = [
      '/images/1.jpeg',
      '/images/2.jpeg',
      '/images/3.jpeg',
      '/images/4.jpeg'
    ];
    
    teamImages.forEach((img, index) => {
      if (!img.src || img.src.includes('placeholder') || img.src.endsWith('team-member.jpg')) {
        img.src = teamPhotos[index % teamPhotos.length];
      }
    });
  }
  
  // Fix testimonial images
  const testimonialImages = document.querySelectorAll('.testimonial-author img');
  if (testimonialImages.length > 0) {
    const testimonialPhotos = [
      '/images/5.jpeg',
      '/images/6.jpeg',
      '/images/7.jpeg'
    ];
    
    testimonialImages.forEach((img, index) => {
      if (!img.src || img.src.includes('placeholder') || img.src.endsWith('testimonial.jpg')) {
        img.src = testimonialPhotos[index % testimonialPhotos.length];
      }
    });
  }
  
  // Fix broken images
  fixBrokenImages();
}

/**
 * Fix broken images by providing fallback images
 */
function fixBrokenImages() {
  // Get all images on the page
  const images = document.querySelectorAll('img');
  
  // Add error event listener to each image
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Check if image is already handled
      if (this.getAttribute('data-error-handled')) return;
      
      // Mark as handled to prevent infinite loops
      this.setAttribute('data-error-handled', 'true');
      
      // Determine fallback image based on context
      let fallbackImage = '/images/Luxury Mansion.jpeg'; // Default fallback
      
      // Check if it's a property image
      if (this.closest('.property-image')) {
        fallbackImage = getRandomPropertyImage();
      }
      // Check if it's a team member image
      else if (this.closest('.team-image')) {
        fallbackImage = '/images/1.jpeg';
      }
      // Check if it's a testimonial image
      else if (this.closest('.testimonial-author')) {
        fallbackImage = '/images/5.jpeg';
      }
      
      // Set fallback image
      this.src = fallbackImage;
    });
  });
}

/**
 * Get a random property image from the available images
 * @returns {string} Image path
 */
function getRandomPropertyImage() {
  const images = [
    '/images/Luxury Villa in Beverly Hills.jpeg',
    '/images/Penthouse in NYC.jpg',
    '/images/Beachfront Condo in Miami.jpeg',
    '/images/Modern Apartment in Downtown NYC.jpeg',
    '/images/Suburban Home in Austin.jpeg',
    '/images/Mountain Retreat.jpeg',
    '/images/Luxury Mansion.jpeg',
    '/images/Luxury City Apartment.jpeg',
    '/images/Beachside Villa.jpeg',
    '/images/Cozy Cottage in Portland.jpeg',
    '/images/City Loft in Chicago.jpeg',
    '/images/Modern Studio in Los Angeles.jpeg'
  ];
  
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
} 