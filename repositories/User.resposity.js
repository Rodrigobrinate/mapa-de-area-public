const { PrismaClient } = require('@prisma/client');
const { response } = require('express');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_INTRNAL
        }
    }
});



exports.user = async () => {
    return await prisma.user.findMany({}).then((response) => {
        return { response, status: 200, msg: "sucess" }
    }).catch((err) => {
        return { status: 500, msg: "ocorreu um erro ao buscar usuários, entre em contato com o suporte", response: err }
    })
}




exports.serarchUser = async (name,dp) => {
    console.log(dp)
    return await prisma.user.findMany({
        where: {
            name: {
                contains: name
            },
            department_id: {
                in: dp,
            },
            OR: [
                {status: "normal"},
                {status: "Normal"}
            ]
            
        }
    }).then((response) => {
        return { status: 200, response: response, msg: "sucess" }
    }
    ).catch((err) => {
        return { status: 500, response: err, msg: "ocorreu um erro ao buscar usuários, entre em contato com o suporte" }
    })


}


exports.findUserByEmail = async (email) => {

    return await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            department: true
        }
    }).then((response) => {
        return { status: 200, response: response, msg: "sucess" }
    }).catch((err) => {
        return { status: 500, response: err, msg: "ocorreu um erro ao buscar usuário, entre em contato com o suporte" }
    })

}
  

exports.findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            department: true
        }
    }).then((response) => {
        return { status: 200, response: response, msg: "sucess" }
    }).catch((err) => {
        return { status: 500, response: err, msg: "ocorreu um erro ao buscar ususario, entre em contato com o suporte" }
    })
}


exports.create = async (name, email, passwordHash) => {

    return await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: passwordHash,
            department_id: 1
        }
    }).then((response) => {
        return { status: 200, response, msg: 'usuário cadastrado com sucesso' }
    }).catch((err) => {
        return { status: 500, response: err, msg: 'ocorreu um erro ao se cadastrar, entre em contato com o suporte ' }
    })
}




exports.findAllByDepartment = async (department) => {
    return await prisma.user.findMany({
        where: {
            department_id: department,
            status: "Normal"
        },
        orderBy:{
            name: "asc"
        },
        select: {
            id: true,
            name: true,
            email: true,
            department: true
        }
    }).then((response) => {
        return {
            msg: 'success',
            status: 200,
            response: response
        }
    }).catch((err) => {
        return {
            status: 500,
            response: err,
            msg: 'ocorreu um erro ao buscar usuário, entre em contato com o suporte'
        }
    })
}


exports.departments = async (departments) => {
    return await prisma.departments.findMany({
        where: {
            id: {
                in: departments
            }
        }
    }).then((resp) => {
        return { status: 200, msg: 'success', response: resp }
    }).catch((err) => {
        return { status: 500, response: [], msg: 'ocorreu um erro buscar departamentos, entre em contato com o suporte' }
    })
}

exports.update = async (id, name, email, department, password) => {

    console.log(email)
  return  await prisma.user.update({
        data:{
            name: name, 
            email: email,
            department_id: department,
            password: password
        },
        where: {
            id: id
        }
    }).then((respo) => {
        return { status: 200, response: respo, msg: 'dados alterados com sucesso' }
    }).catch((error) => {
        return { status: 500, response: [error], msg: 'ocorreu um erro ao atualizar usuário, entre em contato com o suporte' }
    })
}


exports.delete = async (id) => { 
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            status: "Desativado"
        }
    }).then((response) => {
        return {status: 200, response, msg: "success"}
    }).catch((error) => {
        return { status: 500, response: [], msg: 'ocorreu um erro ao deletar usuário, entre em contato com o suporte' }
    })
}