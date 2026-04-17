module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const message = err && err.message ? err.message : 'Internal server error';
  return res.status(500).json({ error: message });
};