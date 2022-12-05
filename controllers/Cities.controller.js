const citiesService = require("../services/cities.service")

exports.city = async (req, res) => { 
   const response = await citiesService.city()
   res.status(response.status).json({msg: response.msg, response: response.response})
} 


exports.update = async (req, res) => {
   const {id, name, name2} = req.body

   const response = await citiesService.update(id, name, name2)
  res.status(response.status).json({msg: response.msg, response: response.response})


}

exports.delete = async (req, res) => {
   const {id} = req.params

   const response = await citiesService.delete(id)
  res.status(response.status).json({msg: response.msg, response: response.response})

}