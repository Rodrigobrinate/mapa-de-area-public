const { response } = require("express")
const UserRepository = require("../repositories/User.resposity")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.user = async () => {
    return await UserRepository.user()
}


exports.searchColaborator = async (name) => {

    return UserRepository.serarchUser(name)
}


exports.findUserByEmail = async (email) => {
    return await UserRepository.findUserByEmail(email)
}

exports.findUserById = async (id) => {
    return await UserRepository.findUserById(id)
}


exports.create = async (name, email, password) => {
    const passwordHash = await bcrypt.hash(password, 10);
 console.log("teste a senha: "+await bcrypt.compareSync(password, passwordHash))
    const user = await this.findUserByEmail(email)
    if (user.response != null) {
        return { status: 406, response:[user], msg: 'Email já utilizado' }
    } else {
       
        return await UserRepository.create(name, email, passwordHash)
    }
}

exports.login = async (email, password) => {

    const user = await this.findUserByEmail(email)
console.log(user)
    if (!user.status || !user.response || user.status == 500) {
        return {
            status: 401,
            msg: 'usuário ou senha inválidos',
            response: []
        }

    } else {
        console.log(user)
        const verifyPassword = await bcrypt.compare(password, user.response.password)
        if (!verifyPassword) {
            return {
                status: 401,
                response: [password, user.response.password, verifyPassword], 
                msg: 'usuário ou senha inválidos '
            }
        } else {
            const token = jwt.sign({
                id: user.response.id,
                email: user.response.email,
                name: user.response.name,
                department: user.response.department
            }, process.env.SECRET, {
                expiresIn: '24h'
            })
            return {
                msg: 'Login successful',
                status: 200,
                response: {
                token: token,
                name: user.response.name,
                email: user.response.email,
                id: user.response.id,
                department: user.response.department
            }
            }
        }
    }
}

 
exports.permission = (department, _department) => {
    console.log(department, _department)
    switch(department) {
        case 1:
            if (_department == 3 || _department >= 16){
                
                return true
            }else{
                return false
            }
        case 2:
            if (_department == 3 || _department >= 16){
                return true
            }else{
                return false
            }
        case 3:
            if (_department >= 16){
                return true
            }else{
                return false
            }
        case 4:
            if (_department == 5 || _department >= 16){
                return true
            }else{
                return false
            }
        case 5:
            if (_department >= 16){
                return true
            }else{
                return false
            }
        case 6:
            if (_department == 7 || _department >= 16){
                return true
            }else{
                return false
            }
        case 7:
            if (_department >= 16){
                return true
            }else{
                return false
            }
        case 8:
            if (_department == 9 || _department >= 16){
                return true
            }else{
                return false
            }
        case 9:
            if ( _department >= 16){
                return true
            }else{
                return false
            }
        case 10:
            if (_department  >= 14){
                console.log(_department)
                return true
            }else{ 
                return false
            }
        case 11:
            if (_department == 12 || _department >= 16){
                return true
            }else{
                return false
            }
        case 12:
            if ( _department >= 16){
                return true
            }else{
                return false
            }
        case 13:
            if ( _department >= 16){
                return true
            }else{
                return false
            }
        case 14:
            if (_department >= 15){
                return true
            }else{
                return false
            }
        case 15:
            if (_department >= 16){
                return true
            }else{
                return false
            }
        case 16:
            if (_department >= 17){
                return true
            }else{
                return false
            }
            case 17:
                if (_department >= 17){
                    return true
                }else{
                    return false
                }
        default:
            return false;
    

    }
}


exports.users = async (department, id) => {
    const user = await this.findUserById(id)
    
    const permission = this.permission(department, user.response.department.id)
    if (permission == true){
        return await UserRepository.findAllByDepartment(department)
    }else{
        return {
            status: 401,
            msg: 'usuário não autorizado',
            response: []
        }
    }
}



exports.departments = async (id) => {
    const user = await UserRepository.findUserById(id)
    console.log(user)
    if (user.response == null ){
        return {status: 500, msg: "ocorreu um erro, contate o seuporte"}
    }
    let departmentAcessible = []
    for(let i=1; i < 18; i++){
        //console.log(user)
        const permission = this.permission(i, user.response.department.id)
        console.log(permission, i, user.response)
        if (permission == true){
            departmentAcessible.push(i)
        }
    }
    return await UserRepository.departments(departmentAcessible)
    

}



exports.update = async (id, name, email, department,userId, password) => {

const user = await this.findUserById(userId)

const permission = this.permission(department, user.response.department_id)
console.log(department, permission, user, userId)
if (permission){
    console.log("permission concedida")
    return await UserRepository.update(id, name, email, department, password)
}else{
    return {
        status: 401,
        msg: 'usuário não autorizado',
        response: []
    }
}
}

exports.userUpdate = async (id, name, email,userId, password) => {

    const user = await this.findUserById(userId)
    if (password == '' || password == undefined){
        return await UserRepository.update(id, name, email,user.response.department.id, user.response.password)
    }else{
        console.log(password)
        return await UserRepository.update(id, name, email,user.response.department.id, password)
    }
        
   
    }

exports.delete = async (id) => {
    return await UserRepository.delete(id)
}