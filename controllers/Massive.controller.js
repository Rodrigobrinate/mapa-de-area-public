const MassiveService = require('../services/Massive.service')


 exports.createMassive = (req, res) => {
    MassiveService.createMassive(req, res)
}

    exports.massive = (req, res) => {
    MassiveService.massive(req, res)
}

exports.search = (req, res) => {
    MassiveService.search(req, res)
}

exports.createClientMassive = (req, res) => {
    MassiveService.createClientMassive(req, res)
}
exports.clientMassiveview = (req, res) => {
    MassiveService.clientMassiveview(req, res)
}