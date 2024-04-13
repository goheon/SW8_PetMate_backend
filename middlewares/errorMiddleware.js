export default (err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message });
};

export class customError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
