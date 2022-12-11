const  EscalaRepository = require("../repositories/Escala.repository.js")



exports.create = async (user_id,colaborator,date, time, department) => {
    
    if (user_id == 3) {
        return await EscalaRepository.create(colaborator,date, time, department)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", respoonse:[]}
    }

        
}


exports.search = async (startDate, endDate, department) => {


    return await EscalaRepository.search(startDate, endDate, department)
} 

exports.update = async (user_id,date, id, time, colaborator, department) => {
    if (user_id == 3) {
        return await EscalaRepository.update(date, id, time, colaborator, department)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", respoonse:[]}
    }

    
} 



exports.delete = async (user_id,id) => {
    if (user_id == 3) {
        return await EscalaRepository.delete(id)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", respoonse:[]}
    }

    
} 