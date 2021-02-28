const defectRepository = require('./repository/defect')
const machineRepository = require('./repository/machine')
const { InvalidError } = require('./errors')
const { DefectStatusEnum } = require('./enums')

const getDefect = async (machineId) => {
  await machineRepository.machineExists(machineId)

  const defect = defectRepository.find(machineId)

  return {
    data: { defect }
  }
}

const createDefect = async ({ personalNumber, description, machineId }) => {
  const defect = await defectRepository.createDefect({
    personalNumber,
    description,
    machineId
  })

  console.info(`Successfully set the defect for machine ${machineId} with ${description} by - ${personalNumber}`)

  return {
    data: {
      message: 'Successfully set the defect',
      defect
    }
  }
}

const getDefects = async (machineId) => {
  await machineRepository.machineExists(machineId)

  const defects = await defectRepository.getDefectsByMachineId(machineId)

  return {
    data: { defects }
  }
}

const setDefectStatus = async ({ machineId, defectTime, status }) => {
  if (!Object.values(DefectStatusEnum).some(v => v === status)) {
    throw new InvalidError(`Invalid defect status: ${status}`)
  }

  await machineRepository.machineExists(machineId)

  await defectRepository.setDefectStatusForMachineId(machineId)

  let successMessage = 'Successfully updated the status of defect'

  if (status === DefectStatusEnum.STUCK_HEADER) {
    await machineRepository.setMachineStatus({ machineId, status })
    successMessage = `Successfully updated and set the status of the machine ${machineId}`
  }

  console.info(successMessage)

  return {
    data: {
      message: successMessage
    }
  }
}

const getAll = async ({ limit, offset }) => {
  const defects = await defectRepository.getDefectsByStatuses({
    statuses: Object.values(DefectStatusEnum),
    pagination: {
      limit,
      offset
    }
  })

  return defects
}

module.exports = {
  getDefect,
  createDefect,
  getDefects,
  setDefectStatus,
  getAll
}
