const RegisterService = require('../services/Register.service')


 exports.register = (req, res) => {
    RegisterService.register(req, res)
}