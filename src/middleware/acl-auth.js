module.exports = (capability) => {
  return (req, res, next) => {
    if (req.capabilities.includes(capability))
    { next(); }
    else
    {
      next('credentials do not match');
    }
  };
};