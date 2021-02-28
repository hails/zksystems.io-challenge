const db = require('../database')
const { DefectStatusEnum } = require('../enums')
const { InvalidError } = require('../errors')

const getDefectByMachineId = async (machineId) => {
  return db('defect')
    .findOne({ where: { machineId } })
}

const createDefect = async ({ personalNumber, description, machineId }) => {
  const personalNumberCount = db('worker_registry')
    .count({ where: { personalNumber } })

  const machineIdCount = db('machine')
    .count({ where: { machineId } })

  const [personalNumberExists, machineExists] = await Promise.all([
    personalNumberCount,
    machineIdCount
  ])

  if (!personalNumberExists) {
    throw new InvalidError(`Invalid personal number: ${personalNumber}`)
  }

  if (!machineExists) {
    throw new InvalidError(`Invalid machineId: ${machineId}`)
  }

  return db('defect')
    .insert({
      personalNumber,
      description,
      machineId,
      // defectTime could be handled by the model/migration definition using something like { default: 'NOW'}
      status: DefectStatusEnum.NOT_WORKING
    })
}

const getDefectsByMachineId = async (machineId) => {
  return db('defect')
    .find({ where: { machineId } })
    .orderBy('defect_time', 'DESC')
}

const setDefectStatusForMachineId = async ({ machineId, defectTime, status }) => {
  await db('defect')
    .update({ status })
    .where({ machineId, defectTime })
}

const getDefectsByStatuses = async ({ statuses, pagination }) => {
  await db('defect')
    .join('worker_registry', 'defect.personal_number', '=', 'worker_registry.personal_number')
    .select()
    .where({ 'defect.status': { 'Op.in': statuses } }, { ...pagination })
}

module.exports = {
  getDefectByMachineId,
  createDefect,
  getDefectsByMachineId,
  setDefectStatusForMachineId,
  getDefectsByStatuses
}
