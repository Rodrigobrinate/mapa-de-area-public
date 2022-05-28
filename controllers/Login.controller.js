const LoginService = require('../services/Login.service')


 exports.login = (req, res) => {
    LoginService.login(req, res)
}