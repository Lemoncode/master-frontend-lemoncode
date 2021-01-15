const hotelMiddleware = (req, res, next) => {
  if (req.method === 'POST') {
    req.body = {
      ...req.body,
      thumbNailUrl: '/thumbnails/new-hotel.jpg',
    };
  }
  next();
};

module.exports = (req, res, next) => {
  if (req.path === '/hotels') {
    hotelMiddleware(req, res, next);
  } else {
    next();
  }
};
