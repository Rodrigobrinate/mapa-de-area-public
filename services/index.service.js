
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ datasources: {  db: { url: "mysql://root:123456@mysqldb:3306/mapa-de-area" } } });
exports.index = async (req, res) => {
    const date = (new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+(new Date().getDate()-1)).toString()
    console.log(date)
    const city = await prisma.city.findMany({
       
        include: {
            user_in_city: {
                
           include: {
              user: true,
          }
            }
      }
    })
    res.json(city)
}


exports.search = async (req, res) => {
    const city = await prisma.city.findMany({
       
        include: {
          user_in_city: {
              where: {
                  date: new Date(req.body.date),
              },
         include: {
            user: true,
        }
          }
    }
    })
    res.json(city)
}



exports.city = async (req, res) => {
    const city = await prisma.city.findMany({})
    res.json(city)
}
exports.colaborator = async (req, res) => {
    const colaborator = await prisma.user.findMany({})
    res.json(colaborator)
}


exports.delete = async (req, res) => {

    if (req.user.acesse_level == 1){

    
    const del = await prisma.user_in_city.delete({
        where: {
          id: req.body.id,
        },
      })
    res.json(del)
    }else{ 
         res.json({msg: "Sem permissão"})
        }
}


exports.create = async (req, res) => {

    console.log(req.body)
    const create = await prisma.user_in_city.create({
        data: {
        city_id: parseInt(req.body.city),
        User_id:  parseInt(req.body.colaborator),
        periodo:req.body.period,
        date: new Date(req.body.date),
        type: req.body.type  
}})
    res.json(create)
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
})
    res.json(create)
}


