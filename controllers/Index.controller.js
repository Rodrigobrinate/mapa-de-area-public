const IdexService = require('../services/index.service')


 exports.index = (req, res) => {
    IdexService.index(req, res)
}
exports.search = (req, res) => {
    IdexService.search(req, res)
}


exports.city = (req, res) => {
    IdexService.city(req, res)
}
exports.colaborator = (req, res) => {
    IdexService.colaborator(req, res)
}
exports.create = (req, res) => {
    IdexService.create(req, res)
}
exports.teste = (req, res) => {
    IdexService.teste(req, res)
}
exports.delete = (req, res) => {
    IdexService.delete(req, res)
}