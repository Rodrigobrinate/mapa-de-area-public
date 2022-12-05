const citiesRepository = require("../repositories/cities.repository")

exports.city = async (req, res) => {
   return await citiesRepository.city()
} 


exports.update = async (id,name, name2) => {

   return await citiesRepository.update(id, name, name2)

}

exports.delete = async (id) => {

   return await citiesRepository.delete(id)

}