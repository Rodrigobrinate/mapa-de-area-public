const citiesService = require("../services/cities.service")

exports.city = async (req, res) => { 
   const response = await citiesService.city()
   res.status(response.status).json({msg: response.msg, response: response.response})
} 