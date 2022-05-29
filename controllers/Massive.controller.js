const MassiveService = require('../services/Massive.service')


 exports.createMassive = (req, res) => {
    MassiveService.createMassive(req, res)
}

    exports.massive = (req, res) => {
    MassiveService.massive(req, res)
}