'use strict';


// Default error handling middleware.
module.exports = function deafultErrorHandler(error, req, res, next) {
    console.error(error);
  
    if (req.headersSend) next(error);
    else {
      res
        .status(500)
        .json({ error });
    }
  };
  