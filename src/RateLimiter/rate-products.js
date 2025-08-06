import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

// Product Listing Rate Limiter - Liberal for browsing
export const productListingRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many product listing requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return `product-listing-${ip}`;
  },
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 10 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many product requests. Please try again after ${remainingTime} minutes.`,
      retryAfter: `${remainingTime} minutes`,
      type: "product_listing_limit"
    });
  }
});

// Random Products (Swiper) Rate Limiter
export const randomProductsRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: "Too many swiper requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return `random-products-${ip}`;
  },
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 10 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Swiper loading too frequently. Please try again after ${remainingTime} minutes.`,
      retryAfter: `${remainingTime} minutes`,
      type: "swiper_limit"
    });
  }
});

// Category Products Rate Limiter
export const categoryProductsRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 80,
  message: {
    success: false,
    message: "Too many category browsing requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return `category-products-${ip}`;
  },
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 10 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many category requests. Please try again after ${remainingTime} minutes.`,
      retryAfter: `${remainingTime} minutes`,
      type: "category_limit"
    });
  }
});

// Single Product Rate Limiter
export const singleProductRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many product detail requests. Please try again in 10 minutes.",
    retryAfter: "10 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return `single-product-${ip}`;
  },
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 10 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Too many product views. Please try again after ${remainingTime} minutes.`,
      retryAfter: `${remainingTime} minutes`,
      type: "product_detail_limit"
    });
  }
});

// Anti-Scraping Rate Limiter
export const antiScrapingRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: "Suspicious activity detected. Please slow down your requests.",
    retryAfter: "5 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return `anti-scraping-${ip}`;
  },
  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime || new Date(Date.now() + 5 * 60 * 1000);
    const remainingTime = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    res.status(429).json({
      success: false,
      message: `Suspicious activity detected. Please try again after ${remainingTime} minutes.`,
      retryAfter: `${remainingTime} minutes`,
      type: "anti_scraping_limit",
      warning: "Automated requests are not allowed"
    });
  }
});
