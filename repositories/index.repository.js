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


exports.delete = async (myUser,userAdded, cidade,date, id) => {
   return await prisma.user_in_city.delete({
        where: {
        id: id,
        }, 
    }).then(async (response) => {

        await prisma.mapa_area_logs.create({
            data: {
                description: `<strong>${myUser.response.name} </strong>
                removeu o  colaborador  
                <strong>${userAdded.response.name}  </strong>
                da cidade  
                <strong>${cidade.response.name.split("|", 1)} </strong>
                   
                em <strong>${new Date(date).toLocaleDateString("pt-BR")}</strong> `
            }
        }).catch((err) => {
            return {status: 500, 
                msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", err}
            })

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
     )
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


exports.create = async (cidade, colaborator_added, myUser, city, colaborator, period, date, type) => {
  console.log(cidade)
    return  await prisma.user_in_city.create({
        data: {
        city_id: parseInt(city),
        User_id:  parseInt(colaborator),
        periodo:    period.toString(),
        date: new Date(date),
        type: type.toString()
}}).then(async (response) => {

    await prisma.mapa_area_logs.create({
        data: {
            description: `<strong>${myUser.response.name} </strong>
            adicionou  <strong>${colaborator_added.response.name}  </strong>
            à cidade 
            <strong>${cidade.response.name.split("|", 1)} </strong>
             para realizar serviço de 
             <strong>${type == 1 ? "intalação" : ""}</strong> 
             <strong>${type == 2 ? "intalação/reparo" : ""} </strong>
             <strong>${type == 3 ? "reparo" : ""} </strong>
            no periodo  
            <strong>${period == 1 ? " do dia" : "da noite "} </strong>
            em  <strong>${new Date(date).toLocaleDateString("pt-BR")}</strong> 
            `
        }
    }).catch((err) => {
        console.log({status: 500, 
            msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", },err)
        })

    return {status: 201, msg: " técnico cadastrado com sucesso", response}
}).catch((err) => {
    return {status: 500, msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", err}
    })

}




exports.createLogs = async (myUser, colaborator_added, cidade, type,period) => {
    await prisma.mapa_area_logs.create({
        data: {
            description: `<strong>${myUser.response.name} </strong>
            adicionou  <strong>${colaborator_added.response.name}  </strong>
            à cidade 
            <strong>${cidade.response.name.split("|", 1)} </strong>
             para realizar serviço de 
             <strong>${type == 1 ? "intalação" : ""}</strong> 
             <strong>${type == 2 ? "intalação/reparo" : ""} </strong>
             <strong>${type == 3 ? "reparo" : ""} </strong>
            no periodo  
            <strong>${period == 1 ? " do dia" : "da noite "} </strong>
           `
        }
    }).catch((err) => {
        console.log({status: 500, 
            msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", },err)
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


 exports.logs = async (page) => {
    const take = 10*page
    return await prisma.mapa_area_logs.findMany({
        orderBy: {
            id: "desc",
        },
        skip: take-10,
        take: take,
    }).then((response) => {
         return {status: 200, response: response, msg: "sucess"}
     }).catch((err) => {
        return {status: 500, msg: 'ocorreu um erro ao buscar cidades, contate o suporte', response: err}
     })
 } 





exports.findCityById = async (id) => {
    return await prisma.city.findFirst({
        where: {
            id: id
        }
     
     }).then((response) => {
         return {status: 200, response: response, msg: "sucess"}
     }).catch((err) => {
        return {status: 500, msg: 'ocorreu um erro ao buscar cidades, contate o suporte', response: err}
     })
 } 


 exports.EditType = async (myUser, oldertype,cidade, userAdded, id, type) => {

    return await prisma.user_in_city.update({
        where: {
            id: id
        },
        data: {
            type: type
        }
    }).then(async (response) => {

        await prisma.mapa_area_logs.create({
            data: {
                description: `<strong>${myUser.response.name} </strong>
                alterou a tipo de serviço do colaborador  
                <strong>${userAdded.response.name}  </strong>
                na cidade  
                <strong>${cidade.response.name.split("|", 1)} </strong>
                de 
                <strong>${oldertype == 1 ? "intalação" : ""}</strong> 
                <strong>${oldertype == 2 ? "intalação/reparo" : ""} </strong>
                <strong>${oldertype == 3 ? "reparo" : ""} </strong>
                 para 
                 <strong>${type == 1 ? "intalação" : ""}</strong> 
                 <strong>${type == 2 ? "intalação/reparo" : ""} </strong>
                 <strong>${type == 3 ? "reparo" : ""} </strong>
                `
            }
        }).catch((err) => {
            console.log({status: 500, 
                msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", },err)
            })

        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
        console.log({status: 500, 
            msg: "ocoorreu um erro ao alterar  o tipo de serviço do técnico, contate o suporte", },err)
        })

 }

 exports.EditPeriod = async (myUser, Olderperiod, cidade, userAdded, id, period) => {
    console.log(period)
    return await prisma.user_in_city.update({
        where: {
            id: id
        },
        data: {
            periodo: period
        }
    }).then(async (response) => {
        

        await prisma.mapa_area_logs.create({
            data: {
                description: `<strong>${myUser.response.name} </strong>
                alterou o periodo de serviço do colaborador  
                <strong>${userAdded.response.name}  </strong>
                na cidade  
                <strong>${cidade.response.name.split("|", 1)} </strong>
                de 
                <strong>${Olderperiod == 1 ? "dia" : "noite "} </strong>
                 para 
                 <strong>${period == 1 ? "  dia" : " noite "} </strong>
                em <strong>${new Date().toLocaleDateString("pt-BR")}</strong> 
                as <strong>${new Date().toLocaleTimeString("pt-BR", {timeZone: "America/Sao_Paulo"})}</strong>`
            }
        }).catch((err) => {
            return {status: 500, 
                msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", err}
            })

        
        return {status: 200, response: response, msg: "sucess"}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro ao editar periodo, contate o suporte', response: err}
    })

 }



 exports.Update = async ( myUser,OlderDate, Oldercity, userAdded,id, city, date) => {
    //console.log(Oldercity)
        return await prisma.user_in_city.update({
            where: {
                id: id
            },
            data: {
                city_id: city.response.id,
                date: new Date(date)
            }
        }).then(async (response) => {



            await prisma.mapa_area_logs.create({
                data: {
                    description: `<strong>${myUser.response.name} </strong>
                    ${new Date(new Date(date).toLocaleDateString("en-US")).getTime()
                    == new Date(new Date(OlderDate).toLocaleDateString("en-US")).getTime() ? 
                    `alterou a cidade de serviço do colaborador  
                    <strong>${userAdded.response.name}  </strong>
                    da cidade  
                    <strong>${Oldercity.response.name.split("|", 1)} </strong>
                    para 
                    <strong>${city.response.name.split("|", 1)} </strong>
                    em <strong>${new Date(date).toLocaleDateString("pt-BR")}</strong>
                     
                     `
                 
                    : `<strong>${myUser.response.name} </strong>
                    ${Oldercity.response.id == city.response.id ? 
                   ` alterou o periodo de serviço do colaborador  
                  <strong>${userAdded.response.name}  </strong>
                  na cidade  
                  <strong>${city.response.name.split("|", 1)} </strong>
                  de <strong>${new Date(OlderDate).toLocaleDateString("pt-BR")}</strong> 
                    para 
                  em <strong>${new Date(date).toLocaleDateString("pt-BR")}</strong> 
                     `
                  : 
                    ` 
                    alterou a cidade de serviço do colaborador  
                    <strong>${userAdded.response.name}  </strong>
                    da cidade  
                    <strong>${Oldercity.response.name.split("|", 1)} </strong>
                    para 
                    <strong>${city.response.name.split("|", 1)} </strong>
                    e alterou o dia de serviço 
                    de <strong>${new Date(OlderDate).toLocaleDateString("pt-BR")}</strong> 
                    para <strong>${new Date(date).toLocaleDateString("pt-BR")}</strong> 
                  ` }`}  
                    `
                }
            })


            return {status: 200, response: response, msg: "sucess"}
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