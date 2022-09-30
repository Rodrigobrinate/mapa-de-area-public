const citiesRepository = require("../repositories/cities.repository")

exports.city = async (req, res) => {
   return await citiesRepository.city()
} 