/**
 * LuxuryHomes - Clear Credentials Script
 * This script removes all authentication and user data from localStorage
 */

// Function to clear all credentials from localStorage
function clearAllCredentials() {
  // Remove authentication token
  localStorage.removeItem('token');
  
  // Remove user data
  localStorage.removeItem('user');
  
  // Remove users array (all registered users)
  localStorage.removeItem('users');
  
  // Remove contact messages
  localStorage.removeItem('contactMessages');
  
  // Remove any other potential sensitive data
  localStorage.removeItem('favorites');
  localStorage.removeItem('recentSearches');
  
  // Log success message
  console.log('All credentials and user data have been successfully removed from localStorage');
  
  // Show alert to user
  alert('All credentials and user data have been successfully removed from localStorage');
}

// Execute the function immediately
clearAllCredentials(); 