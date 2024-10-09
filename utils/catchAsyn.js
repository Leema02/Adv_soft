const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    //   fn(req, res, next).catch((err) => {
    //     console.error('ERROR 💥:', err);
  
    //     const statusCode = err.statusCode || 500;
    //     const status = err.status || 'error';
  
    //     res.status(statusCode).json({
    //       status: status,
    //       message: err.message || 'Something went wrong!',
    //     });
    //   });
    };
  };

  
  module.exports = catchAsync;
  