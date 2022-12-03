const { reset } = require("nodemon")
const UserService = require("../services/User.service")


exports.user = async (req, res) => {
    const response = await UserService.user()

    res.status(response.status).json({ msg: response.msg, response: response.response })
}


exports.serarchUser = async (req, res) => {
    const { name } = req.params
    const {department} = req.body
    const response = await UserService.searchColaborator(name, department)
    res.status(response.status).json({ msg: response.msg, response: response.response })
}

exports.create = async (req, res) => {
    let { name, email, password, } = req.body;
    var a = email == null
    var b = password == null
    var c = name == null
    var e = email == ""
    var f = name == ""
    var g = password == ""
    var i = email == undefined
    var j = password == undefined
    var k = name == undefined

console.log(req.body)
    // validacao de campos
    if (a || b || c || e || f || g || i || j || k) {
        res.status(406).json({ status: 0, msg: "Preencha todos os campos" })
    } else {

        if (password.length <= 3) {
            res.status(406).json({ status: 0, msg: "sua senha deve ter no minimo 8 caracteres" })
        } else {
            const response = await UserService.create(name, email, password)
            
            res.status(response.status).json({ msg: response.msg, response: response.response })
        }

    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password || email == undefined || password == undefined) {
        return res.status(406).json({ msg: 'preencha todos os campos', st: 0 })
    }else {
        const response = await UserService.login(email, password)
        res.status(response.status).json({ msg: response.msg, response: response.response })
    }

}

exports.users = async (req, res) => {
    const { department } = req.params

    if (!department) {
        return res.status(406).json({ msg: 'preencha todos os campos', st: 0 })
    } else {
        const response = await UserService.users(parseInt(department), req.user.id)
        res.status(response.status).json({ msg: response.msg, response: response.response })
    }
}

exports.departments = async (req, res) => {
    //console.log(req.user.email)
    const response = await UserService.departments(req.user.id)
    
    res.status(response.status).json({ msg: response.msg, response: response.response })
}

 

exports.update = async (req, res) => {
    const {id, name, email, department, password} = req.body
    console.log(req.user.id)
    if (password == ''){
        const response = await UserService.update(id, name, email, department, req.user.id)
        res.status(response.status).json({ msg: response.msg, response: response.response })
    }else{
        const response = await UserService.update(id, name, email, department, req.user.id, password)
        res.status(response.status).json({ msg: response.msg, response: response.response })
    }

}

exports.userUpdate = async (req, res) => {
    const { name, email, password, department} = req.body
    if (password == ''){
        const response = await UserService.userUpdate(parseInt(req.user.id), name, email, req.user.id)
        res.status(response.status).json({ msg: response.msg, response: response.response })
    }else{
        const response = await UserService.userUpdate(parseInt(req.user.id), name, email, req.user.id, password)
        res.status(response.status).json({ msg: response.msg, response: response.response })
    }
}


exports.delete = async (req, res) => {
    const {id} = req.params

    const response = await UserService.delete(parseInt(id))
    res.status(response.status).json({ msg: response.msg, response: response.response })
}