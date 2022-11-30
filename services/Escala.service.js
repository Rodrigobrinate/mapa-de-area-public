const  EscalaRepository = require("../repositories/Escala.repository.js")



exports.create = async (colaborator,date, time) => {


        return await EscalaRepository.create(colaborator,date, time)
}


exports.search = async (startDate, endDate) => {


    return await EscalaRepository.search(startDate, endDate)
} 

exports.update = async (date, id, time, colaborator) => {


    return await EscalaRepository.update(date, id, time, colaborator)
} 



exports.delete = async (id) => {


    return await EscalaRepository.delete(id)
} 