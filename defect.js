const {dbConnecter}=require("./dbConnector")
const {logger}=require("./logger");
const moment = require('moment-timezone');

const {machineInfo}=require("./machine");
var mI= new machineInfo();
const {processInfo}=require("./process");
var processInfoObj= new processInfo();

class defectInfo{

    constructor(){}

    async getDefectInfo(machineId){
        try {
            let machineExist= (await dbConnecter.table('machine').where({'machine_id':machineId}).count())[0].count

            if(machineExist!=1){
                let result={}
                result["error"]={}
                result["error"]["code"]=400
                result["error"]["message"]="Machine Id doesn't exist"
                return result  
            }

            
                return dbConnecter.table('defect')
                .where({'machine_id':machineId})
                .then(async(result)=>{
                    return result;             
                })
                .catch((error)=>{
                    logger.log({
                        level: 'error',
                        message: error.toString(),
                    })
                    let result={}
                    result["error"]={}
                    result["error"]["code"]=500
                    result["error"]["message"]=error.toString()
                    return result  
                })
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result   
        }
    }
    async setDefect(personalNumber,description,machineId){
        try {
            let personalNumberExists=(await dbConnecter.table('worker_registry').count().where({'personal_number':personalNumber}).count())[0].count
            if(personalNumberExists==0){
                let result={}
                result["error"]={}
                result["error"]['code']=400
                result["error"]['message']="Invalid personal number"
                return result
            }

            let machineIdExists=(await dbConnecter.table('machine').count().where({'machine_id':machineId}).count())[0].count
            if(machineIdExists==0){
                let result={}
                result["error"]={}
                result["error"]['code']=400
                result["error"]['message']="Invalid machine id"
                return result
            }

                return dbConnecter.table('defect')
                .insert({'personal_number':personalNumber,'description':description,'machine_id':machineId,'defect_time':moment().tz('Europe/Berlin').format('YYYYMMDD HHmmss'),'status':1})
                .then(async(result,error)=>{
                        if(result.rowCount=='1'){   
                            logger.log({
                                level: 'info',
                                message:"Successfully set the defect for machine "+machineId+" with "+description+ "by -"+personalNumber
                            })
                            let result={}
                            result["success"]="Successfully set the defect"
                            return result  
                        }
                        else{
                            logger.log({
                                level: 'error',
                                message:"Failed to insert into defect"
                            })
                            let result={}
                            result["error"]={}
                            result["error"]["code"]=500
                            result["error"]["message"]="Failed to insert into defect" 
                        }                              
                }).catch((error)=>{
                    logger.log({
                        level: 'error',
                        message: error.toString(),
                    })
                    let result={}
                    result["error"]={}
                    result["error"]["code"]=500
                    result["error"]["message"]=error.toString()
                    return result  
                })
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result 
        }
    }

    async getDefectStatus(machineId){
        try {
            let machineExist= (await dbConnecter.table('machine').where({'machine_id':machineId}).count())[0].count

            if(machineExist!=1){
                let result={}
                result["error"]={}
                result["error"]["code"]=400
                result["error"]["message"]="Machine Id doesn't exist"
                return result  
            }
            return dbConnecter.table('defect')
            .where({'machine_id':machineId})
            .orderBy('defect_time','desc')
            .then(async(result)=>{
                return result[0]
            }).catch((error)=>{
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result 
            })
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result 
            
        }
    }

    async setDefectStatus(machineId,defect_time,status){
        try {
            console.log(dbConnecter.table('defect')
            .update({'status':status})
            .where({'machine_id':machineId})
            .andWhere({'defect_time':defect_time}).toString())
            return dbConnecter.table('defect')
            .update({'status':status})
            .where({'machine_id':machineId})
            .andWhere({'defect_time':defect_time})
            .then(async(result)=>{
                console.log(result)
                if(status=='3' && result==1){
                    let result=await mI.setMachineStatus(machineId,1)
                    console.log(result)
                    if(result.success!=''){
                        logger.log({
                            level: "info",
                            message: "Successfully updated and set the status of the machine "+machineId
                        })
                        let result={}
                        result["success"]="Successfully updated and set the status of the machine "+machineId
                        return result   

                    }else{
                        logger.log({
                            level: "error",
                            message: "Failed to set the status of the machine"+machineId
                        })
                        let result={}
                        result["error"]={}
                        result["error"]["code"]=500
                        result["error"]["message"]="Failed to set the status of the machine"+machineId
                        return result 
                    }
                }else if(result==1){
                    let result={}
                    result["success"]="Successfully updated the status of defect "
                    return result   
                }else{
                    let result={}
                    result["error"]={}
                    result["error"]["code"]=500
                    result["error"]["message"]="Failed to set the status of the machine"+machineId
                    return result
                }
            }).catch((error)=>{
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result 
            })
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result 
        }
    }

    async getAllDefect(){
        try {
            let allDefect={}

            return dbConnecter.table('defect')
                .join('worker_registry', 'defect.personal_number', '=', 'worker_registry.personal_number')
                .select()
                .where({'defect.status':1})
                .then(async(result)=>{
                    allDefect["pending"]=result
                    console.log(result.length)
                    return dbConnecter.table('defect')
                    .join('worker_registry', 'defect.personal_number', '=', 'worker_registry.personal_number')
                    .select()
                    .where({'defect.status':2})
                    .then(async(result)=>{
                        allDefect["in_process"]=result
                        console.log(result.length)

                        return dbConnecter.table('defect')
                        .join('worker_registry', 'defect.personal_number', '=', 'worker_registry.personal_number')
                        .select()
                        .where({'defect.status':3})
                        .then(async(result)=>{
                            allDefect["completed"]=result
                            console.log(result.length)

                                return allDefect;
                        })
                    }).catch((error)=>{
                        logger.log({
                            level: 'error',
                            message: error.toString(),
                        })
                        let result={}
                        result["error"]={}
                        result["error"]["code"]=500
                        result["error"]["message"]=error.toString()
                        return result 
                    })
                })
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: error.toString(),
                })
                let result={}
                result["error"]={}
                result["error"]["code"]=500
                result["error"]["message"]=error.toString()
                return result 
        }
    }
    
}

module.exports.defectInfo=defectInfo
