
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });
 


exports.city = async () => {
   return await prisma.city.findMany({
    where: {
        status: "Normal"
    }
    }).then((response) => {
        return {status: 200, msg:"success", response}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro contate o suporte', err}
    }   )
} 


exports.update = async (id, name, name2) => {
    return await prisma.city.update({
        where: {
            id: parseInt(id)
        },
        data: {
            name: name,
            name2: name2
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
        return {status: 500, msg: 'ocorreu um erro ao atualizar cidade contate o suporte', response: err}
     })
 }


 exports.delete = async (id) => {
    return await prisma.city.update({
        where: {
            id: parseInt(id)
        },
        data: {
            status: "Desabled"
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
        return {status: 500, msg: 'ocorreu um erro ao deletar cidade contate o suporte', response: err}
     })
 }
