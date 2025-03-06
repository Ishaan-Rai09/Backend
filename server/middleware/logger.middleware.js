const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, ip } = req;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Add response time logging
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  
  next();
};

module.exports = logger; 