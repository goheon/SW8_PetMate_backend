export default (err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
};

export class customError extends Error {
  constructor(statusCode, message) {
    // if (statusCode === undefined) {
    //   this.statusCode = 500;
    // }
    super(message);
    this.statusCode = statusCode;
  }
}
