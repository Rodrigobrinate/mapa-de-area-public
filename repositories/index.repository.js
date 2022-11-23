const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const { user } = require('./User.resposity');

const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });


exports.search = async (startDate, endDate ,citiesInt) => {
    console.log(startDate, endDate)
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
                    lte: new Date(endDate)
                  }},
                  {
                    date:{
                      gte: new Date(startDate)
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
            
            
          },
                city_alert: {
                    where:{
                        AND: [
                            {
                              date:{
                                lte: new Date(endDate)
                              }},
                              {
                                date:{
                                  gte: new Date(startDate)
                                }},
                          ]
                    }
                
            }}
    }).then((response) => {
        return {status: 200, msg: "success", response:  response}
    }).catch((err) => {
        
        return {status: 500, msg: "ocorreu um erro ao buscar as cidades", response: err}
    })
}


exports.delete = async (id) => {
   return await prisma.user_in_city.delete({
        where: {
        id: id,
        }, 
    }).then((response) => {
       return {status: 200, msg: "técnico deletado com sucesso", response}
        }
    ).catch((err) => {
        return {status: 500, msg: "ocoorreu um erro ao deletar o técnico, contate o suporte", response: err}
    })
}


exports.alertCreate = async (userId, description, date, city) => {
    return await prisma.city_alert.create({
         data: {
            description: description,
            User_id: userId,
            city_id: parseInt(city),
            date: new Date(date)
         }, 
     }).then((response) => {
        return {status: 200, msg: "alerta  criado com sucesso", response}
         }
     ).catch((err) => {
         return {status: 500, msg: "ocoorreu um erro ao criar alerta, contate o suporte", response: err}
     })
 }



 exports.cities_seach = async (data) => {
    return await prisma.city.findMany({
         where: {
                name2: {
                    contains: data
                }
         }, 
     }).then((response) => {
        return {status: 200, msg: "cidade encontrada com sucesso", response}
         }
     ).catch((err) => {
         return {status: 500, msg: "ocoorreu um erro ao encontrar cidade, contate o suporte", response: err}
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
    return {status: 500, msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", err}
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
    return { status: 500, msg: "ocorreu um erro ao buscar técnico, contate o suporte ", response: err}
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
        return {status: 500, msg: 'ocorreu um erro ao buscar cidades, contate o suporte', response: err}
     })
 } 

 exports.EditType = async (id, type) => {

    return await prisma.user_in_city.update({
        where: {
            id: id
        },
        data: {
            type: type
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao editar o tipo, contate o suporte', response: err}
    })

 }

 exports.EditPeriod = async (id, period) => {
    console.log(period)
    return await prisma.user_in_city.update({
        where: {
            id: id
        },
        data: {
            periodo: period
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao editar periodo, contate o suporte', response: err}
    })

 }



 exports.Update = async (id, city, date) => {
        return await prisma.user_in_city.update({
            where: {
                id: id
            },
            data: {
                city_id: city,
                date: new Date(date)
            }
        }).then((response) => {
            return {status: 200, response: response, msg: "sucess"}
        }).catch((err) => {
           return {status: 500, msg: 'ocorreu um erro ao atulizar, contate o suporte', response: err}
        })
 }

 exports.findUserInWork = async (id) => {
    return await prisma.user_in_city.findUnique({
        where: {
            id: id
        },
        include: {
            user: true
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao encontrar usuário contate o suporte', response: err}
    })
 }

 exports.findUserInWorkByDate = async (id,date) => {
    return await prisma.user_in_city.findUnique({
        where: {
            id: id,
            date: new Date(date)
        },
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao encontrar usuário contate o suporte', response: err}
    })
 }

 exports.findUserInWorkByNameAndDate = async (id,city,date) => {
    return await prisma.user_in_city.findMany({
        where: {
            AND: [
                {
                     date: new Date(date),
                },
                {
                    User_id: id
                },
                {
                    city_id: city
                }
            ]
          
        },
           
        include:{
            user: {
                select: {
                    id: true,
                    name: true
                },
               
            }
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao encontrar usuário contate o suporte', response: err}
    })
 }


 exports.findAlertById = async (id) => {
    return await prisma.city_alert.findUnique({
        where: {
            id: id
        },
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao encontrar usuário contate o suporte', response: err}
    })
 }

 exports.alertUpdate = async (id, description) => {
    return await prisma.city_alert.update({
        where: {
            id: id
        },
        data: {
            description: description
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao atualizar alerta contate o suporte', response: err}
    })
 }
 exports.alertDelete = async (id) => {
    return await prisma.city_alert.delete({
        where: {
            id: parseInt(id)
        }
    }).then((response) => {
        return {status: 200, response: response, msg: "sucess"}
    })
 }