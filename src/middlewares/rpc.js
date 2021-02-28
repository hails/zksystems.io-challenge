const defectService = require('../defect')
const { InvalidError, InternalServerError } = require('../errors')

const processRequest = async (req, res, next) => {
  // POST /defect/rpc
  // { method: 'getAll', args: []}
  const { method, args } = req.body

  if (Object.keys(defectService).some(method)) {
    try {
      return defectService[method](...args)
    } catch (error) {
      if (error instanceof InvalidError) {
        // Error handling middleware would take care of formatting
        next(error)
      }

      console.error(JSON.stringify(error))
      next(new InternalServerError('Something went wrong'))
    }
  }
}

module.exports = {
  processRequest
}
