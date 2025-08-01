import Joi from 'joi';

// Validation middleware
export const validateInput = (schema) => {
  return (req, res, next) => {
    // ✅ FIXED - Handle both params and body properly
    let dataToValidate;
    
    if (req.method === 'GET' || req.method === 'DELETE') {
      dataToValidate = req.params;
    } else {
      dataToValidate = req.body;
    }
    
    const { error } = schema.validate(dataToValidate);
    
    if (error) {
      return res.status(400).json({
        message: 'Invalid input',
        details: error.details[0].message
      });
    }
    
    next();
  };
};