const { PrismaClient } = require('@prisma/client');
const { department } = require('../services/Login.service');

const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });


exports.search = async (startDate, endDate ,citiesInt) => {
    return await prisma.city.findMany({
        where:{
            id:{
                    in: citiesInt
                  }},
            
        include: {
          user_in_city: {
            orderBy: {
                date: 'asc'
            },
              where: {
                AND: [
                {
                  date:{
                    lte: endDate
                  }},
                  {
                    date:{
                      gte: startDate
                    }},
                    
                  
              ]},
              
         include: {
                user: {
                    select: {
                    name: true,
                    email: true,
                    id: true,
                    }
                }
            },
            
          } 
      }
    }).then((response) => {
        return {status: 200, msg: "success", response:  response}
    }).catch((err) => {
        
        return {status: 500, msg: "ocorreu um erroo ao buscar as cidades", response: err}
    })
}


exports.delete = async (id) => {
   return await prisma.user_in_city.delete({
        where: {
        id: id,
        }, 
    }).then((response) => {
       return {status: 200, msg: " técnico deletado com sucesso", response}
        }
    ).catch((err) => {
        return {status: 500, msg: "ocoorreu um erro contate o suporte", response: err}
    })
}

exports.create = async (city, colaborator, period, date, type) => {


  return  await prisma.user_in_city.create({
        data: {
        city_id: parseInt(city),
        User_id:  parseInt(colaborator),
        periodo:    period.toString(),
        date: new Date(date),
        type: type.toString()
}}).then((response) => {
    
    return {status: 201, msg: " técnico cadastrado com sucesso", response}

}).catch((err) => {
    return {status: 500, msg: "ocoorreu um erro contate o suporte", err}
    })

}

exports.findBeforeCreate = async (city, colaborator, date) => {
   return await prisma.user_in_city.findFirst({
        where: {
            AND: [
                {
                    User_id: parseInt(colaborator),
                },
                {
                    city_id:  parseInt(city),
                },
                {
                     date: new Date(date),
                }
            ] 
        }
    }).then((response) => {
        return { status: 200, msg: "success", response}
}).catch((err)=> {
    return { status: 500, msg: "ocorreu um erro ", response: err}
})
}


exports.index = async () => {
    return await prisma.city.findMany({
         include: {
             user_in_city: {  
            include: {
             user: {
                 select: {
                   name: true,
                   email: true,
                   id: true,
                 }
               }
           }
      }
       }
     }).then((response) => {
         return {status: 200, response: response, msg: "sucess"}
     }).catch((err) => {
        return {status: 500, msg: 'ocorreu um erro contate o suporte', response: err}
     })
 } 