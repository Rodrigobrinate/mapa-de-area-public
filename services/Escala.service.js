const  EscalaRepository = require("../repositories/Escala.repository.js")



exports.create = async (colaborator,date, time, department) => {


        return await EscalaRepository.create(colaborator,date, time, department)
}


exports.search = async (startDate, endDate, department) => {


    return await EscalaRepository.search(startDate, endDate, department)
} 

exports.update = async (date, id, time, colaborator, department) => {


    return await EscalaRepository.update(date, id, time, colaborator, department)
} 



exports.delete = async (id) => {


    return await EscalaRepository.delete(id)
} 