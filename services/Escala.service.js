const  EscalaRepository = require("../repositories/Escala.repository.js")
const UserService = require('../services/User.service')


exports.create = async (user_id,colaborator,date, time, department) => {
    
    const user = await UserService.findUserById(user_id)
    if (user.response.department.id == 3) {
        return await EscalaRepository.create(colaborator,date, time, department)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", response:[]}
    }

        
}


exports.search = async (startDate, endDate, department) => {


    return await EscalaRepository.search(startDate, endDate, department)
} 

exports.update = async (user_id,date, id, time, colaborator, department) => {

    const user = await UserService.findUserById(user_id)
    console.log(user)
    if (user.response.department.id == 3) {
        return await EscalaRepository.update(date, id, time, colaborator, department)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", response:[]}
    }

    
} 



exports.delete = async (user_id,id) => {
    const user = await UserService.findUserById(user_id)
    if (user.response.department.id == 3) {
        return await EscalaRepository.delete(id)
    }else{
        return {status:401, msg: "você não tem permissão para realizar esta operação", response:[]}
    }

    
} 