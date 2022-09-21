const LoginService = require('../services/Login.service')


 exports.login = (req, res) => {
    LoginService.login(req, res)
}


exports.recovery = (req, res) => {
    LoginService.recovery(req, res)
}

exports.users = (req, res) => {
    LoginService.users(req, res)
} 