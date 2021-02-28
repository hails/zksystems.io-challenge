const db = require('../database')
const { InvalidError } = require('./errors')

const machineExists = async (machineId) => {
  const machineExists = await db('machine')
    .count({ where: { machineId } })

  if (!machineExists) {
    throw new InvalidError(`Invalid machineId: ${machineId}`)
  }

  return true
}

const setMachineStatus = async ({ machineId, status }) => {
  return db('machine')
    .update({ status })
    .where({ machineId })
}

module.exports = {
  machineExists,
  setMachineStatus
}
