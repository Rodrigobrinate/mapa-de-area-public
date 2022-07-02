const EscalaService = require('../services/Escala.service')



exports.index = (req, res) => {
    EscalaService.index(req, res)
}
exports.update = (req, res) => {
    EscalaService.update(req, res)
}

exports.create = (req, res) => {
    EscalaService.create(req, res)
}

exports.indexSuport = (req, res) => {
    EscalaService.indexSuport(req, res)
}