
const EscalaService = require('../services/Escala.service')


exports.create = async (req, res) => {
    const {colaborator,date, time} = req.body
    const response = await EscalaService.create(colaborator,date, time)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 

exports.search = async (req, res) => {
    const {startDate, endtDate} = req.body
    const response = await EscalaService.search(startDate,endtDate)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 

exports.update = async (req, res) => {
    const {date, id, time, colaborator} = req.body
    const response = await EscalaService.update(date, id, time, colaborator)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 

exports.delete = async (req, res) => {
    const {id} = req.params
    const response = await EscalaService.delete(id)
    res.status(response.status).json({msg: response.msg, response: response.response})
} 