class HttpError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

class InvalidError extends HttpError {
  constructor (message) {
    super(message, 400)
  }
}

class InternalServerError extends HttpError {
  constructor (message) {
    super(message, 500)
  }
}

module.exports = {
  InvalidError,
  InternalServerError
}
