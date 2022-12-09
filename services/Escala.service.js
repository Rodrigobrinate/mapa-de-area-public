const  EscalaRepository = require("../repositories/Escala.repository.js")
const UserService = require("./User.service.js")



exports.create = async (userId,colaborator,date, time, department) => {
    const user = await UserService.findUserById(userId)
    if (user.response.department.id == 3) {
        return await EscalaRepository.create(colaborator,date, time, department)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", respoonse:[]}
    }

        
}


exports.search = async (startDate, endDate, department) => {


    return await EscalaRepository.search(startDate, endDate, department)
} 

exports.update = async (userId,date, id, time, colaborator, department) => {
    const user = await UserService.findUserById(userId)
    if (user.response.department.id == 3) {
        return await EscalaRepository.update(date, id, time, colaborator, department)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", respoonse:[]}
    }

    
} 

exports.delete = async (userId,id) => {
    const user = await UserService.findUserById(userId)
    if (user.response.department.id == 3) {
        return await EscalaRepository.delete(id)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", respoonse:[]}
    }

    
} 