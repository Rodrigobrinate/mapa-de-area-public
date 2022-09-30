//onst io = require("../server")
const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const indexRepository = require("../repositories/index.repository")
const UserService = require("./User.service")
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });
 
    /// retorna os dados do mapa de area
exports.index = async () => {
    return indexRepository.index()
} 

/// retorna os dados do mada de area de uma data especifica
exports.search = async (startDate, endDate, citiesInt) => {
    if (endDate < startDate){
        // a data incial não pode ser mair que a final
        return {status: 406, msg: "periodo inválido", response:[]} 
    }else{      
         return await indexRepository.search(startDate, endDate ,citiesInt)
    }   
}


exports.create = async (city, colaborator, type, period, date) => {
    const user = await indexRepository.findBeforeCreate(city, colaborator, date)

    if (user.response != null){
        return { status: 500, msg: "o tecnico já está no local neste dia"}
    }else{
        return await indexRepository.create(city, colaborator, period, date, type)

        }
}




/*
exports.colaborator = async (req, res) => {
    const colaborator = await prisma.user.findMany({})
    res.status(200).json(colaborator)
}
*/
exports.delete = async (id, _user) => {
    const user = await UserService.findUserByEmail(_user.email)
    if (user.response.department.id > 2){
       return await indexRepository.delete(id)
    }else{ 
        return {status:401, msg: "Sem permissão", respoonse:[]}
        } 
} 

/*
///busca um usuario pelo nome
exports.searchColaborator = async (req, res) => {
const {data} = req.params
console.log(data)
   await prisma.user.findMany({
        where: {
            name: {
                contains: data
            }
        }
    }).then((response) => {
        res.json(response)
    }
    ).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    }   )

    
}*/
/// adiciona as cidades os banco de dados
exports.teste = async (req, res) => {
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


