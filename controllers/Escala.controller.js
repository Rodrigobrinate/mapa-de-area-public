
const EscalaService = require('../services/Escala.service')


exports.create = async (req, res) => {
    const {colaborator,date, time, department} = req.body
    const user = req.user
    const response = await EscalaService.create(user.id,colaborator,date, time, department)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 

exports.search = async (req, res) => {
    const {startDate, endtDate, department} = req.body
    //const {department} = req.params
    const response = await EscalaService.search(startDate,endtDate, department)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 

exports.update = async (req, res) => {
    const {date, id, time, colaborator, department} = req.body
    const user = req.user
    const response = await EscalaService.update(user.id,date, id, time, colaborator, department)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 

exports.delete = async (req, res) => {
    const {id} = req.params
    const user = req.user
    const response = await EscalaService.delete(user.id,id)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 