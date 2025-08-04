import rateLimit from 'express-rate-limit';

// Product Listing Rate Limiter - Liberal for browsing
export const productListingRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per 10 minutes
  message: {
    success: false,
    message: "Too many product listing requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `product-listing-${req.ip}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many product requests. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes",
      type: "product_listing_limit"
    });
  }
});

// Random Products (Swiper) Rate Limiter - Most liberal
export const randomProductsRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 150, // 150 requests per 10 minutes (swipers load frequently)
  message: {
    success: false,
    message: "Too many swiper requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `random-products-${req.ip}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Swiper loading too frequently. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes",
      type: "swiper_limit"
    });
  }
});

// Category Products Rate Limiter - Moderate
export const categoryProductsRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 80, // 80 requests per 10 minutes
  message: {
    success: false,
    message: "Too many category browsing requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `category-products-${req.ip}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many category requests. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes",
      type: "category_limit"
    });
  }
});

// Single Product Rate Limiter - Very liberal (users check products frequently)
export const singleProductRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // 200 requests per 10 minutes
  message: {
    success: false,
    message: "Too many product detail requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `single-product-${req.ip}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many product views. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes",
      type: "product_detail_limit"
    });
  }
});

// Anti-Scraping Rate Limiter - Aggressive protection against bots
export const antiScrapingRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // 300 requests per 5 minutes (1 request per second)
  message: {
    success: false,
    message: "Suspicious activity detected. Please slow down your requests.",
    retryAfter: "5 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `anti-scraping-${req.ip}`;
  },
  handler: (req, res) => {
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Suspicious activity detected. Please try again after ${remainingTime} minutes.`,
      retryAfter: remainingTime + " minutes",
      type: "anti_scraping_limit",
      warning: "Automated requests are not allowed"
    });
  }
});