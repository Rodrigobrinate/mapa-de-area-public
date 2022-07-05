
const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });
 
exports.index = async (req, res) => {
    //const date = (new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+(new Date().getDate()-1)).toString()
    await prisma.city.findMany({
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
        res.json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
}

exports.search = async (req, res) => {
    //console.log(new Date(req.body.date),  )
     await prisma.city.findMany({
        include: {
          user_in_city: {
              where: {
                  date: new Date(req.body.date),
              },
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
        res.json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
}


exports.searchColaborator = async (req, res) => {
const {data} = req.params
console.log(data)
   const user = await prisma.user.findMany({
        where: {
            name: {
                contains: data
            }
        }
    })
    res.json(user)
}



exports.city = async (req, res) => {
    const city = await prisma.city.findMany({})
    res.status(200).json(city)
} 
exports.colaborator = async (req, res) => {
    const colaborator = await prisma.user.findMany({})
    res.status(200).json(colaborator)
}


exports.delete = async (req, res) => {
    if (parseInt(req.user.department) > 2){
        await prisma.user_in_city.delete({
            where: {
            id: req.body.id,
            },
        }).then((response) => {
            res.status(200).json({st: 1, msg: " técnico deletado com sucesso", response})
            }
        ).catch((err) => {
            res.status(500).json({st: 1, msg: "ocoorreu um erro contate o suporte", err})
        })
    }else{ 
        res.status(401).json({st:0, msg: "Sem permissão"})
        } 
} 
     
exports.create = async (req, res) => {
const {city, colaborator, type, period, date } = req.body

    if (req.body.city == 0 || req.body.colaborator == 0 || req.body.type == 0 || req.body.period == 0 || req.body.date == "" ) {
        res.status(406).json({
            st: 0,
            msg: "preencha todos os campos"
        })
    }else{ 
    await prisma.user_in_city.create({
        data: {
        city_id: parseInt(req.body.city),
        User_id:  parseInt(colaborator),
        periodo:req.body.period.toString(),
        date: new Date(req.body.date),
        type: req.body.type.toString()
}}).then((response) => {
    res.json({st: 1, msg: " técnico cadastrado com sucesso", response})

}).catch((err) => {
    res.status(500).json({st: 0, msg: "ocoorreu um erro contate o suporte", err})
    })
}
}

exports.teste = async (req, res) => {

    console.log(req.body)
    const create = await prisma.city.createMany({ 
        data: 
        [
        { "name": "ALTO CAPARAÓ"},
        { "name": "ALTO JEQUITIBA"},
        { "name": "ALEGRE"},
        { "name": "ANTONIO PRADO DE MINAS"},
        { "name": "BOM JESUS DO ITABAPOANA"},
        { "name": "BOM JESUS DO NORTE"},
        { "name": "CAIANA"},
        { "name": "CAPARAÓ"},
        { "name": "CARANGOLA"},
        { "name": "DIVINO DE SÃO LOURENÇO"},
        { "name": "DORES DO RIO PRETO"},
        { "name": "ESPERA FELIZ"},
        { "name": "GUAÇUÍ"},
        { "name": "MANHUMIRIM"},
        { "name": "NATIVIDADE"},
        { "name": "OURANIA"},
        { "name": "PEDRA DOURADA"},
        { "name": "PIRAPETINGA"},
        { "name": "PORCIUNCULA"},
        { "name": "QUERENDO"},
        { "name": "SÃO JOSE DO CALÇADO"},
        { "name": "TOMBOS"},
        { "name": "VARRE SAI"}
        ]
}).then((response) => {

    res.status(200).json(response)
}).catch((err) => {
    res.status(500).json({st: 0, msg: "ocoorreu um erro contate o suporte", err})
})
}


