const LoginService = require('../services/Login.service')


 exports.login = (req, res) => {
    LoginService.login(req, res)
}


exports.recovery = (req, res) => {
    LoginService.recovery(req, res)
}