

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });


/// clriar uma nova massiva
exports.createMassive = async (req, res) => {
 const {description, returndate, type,city} = req.body;
   await prisma.massive.create({
        data: {
        description: description,
        returndate: new Date(returndate),
        type: type,
        user_id: parseInt(req.user.id),
        cidade_id: parseInt(city),
        date: new Date(date),
        status: "ativo",
}}).then((response) => {
    res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
} 

//retorna todas as massivas
exports.massive = async (req, res) => {
    await prisma.massive.findMany({
        where: {
            status: "ativo",
        },
        include: {
            city: true,
        }
    }).then((response) => {
        res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
}

//adiciona um cliente ao massiva
exports.createClientMassive = async (req, res) => {
    const { massive_id, problem, name} = req.body;
    // verifica se a massiva existe
    if (massive_id == 0 ) {
            res.status(406).json({
                status: 0,
                msg: "Massiva inválida"
            })
            //verifica se o problma esta preenchido
        }else if (problem == 0 ) {
            res.status(406).json({
                status: 0,
                msg: "problema inválido"
            })
        }
    else{

    
        await prisma.massive.findUnique({
            where: {
                id: parseInt(massive_id),
            },
            include: {
                city: true,
            } 
        }).then(async (response) => { 
        await prisma.client_massive.create({
                data: {
                    massive_id: parseInt(massive_id),
                    problem: problem,
                    name: name,
                    city_id:  parseInt(response.city.id),
                    user_id: parseInt(req.user.id), 
                    status: "ativo", 
                }
            }).then((response) => {
                return res.status(200).json({st: 1, msg: 'Cliente cadastrado com sucesso'})
            }).catch((err) => {
                return res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
            })
    }).catch((err) => {
            res.status(500).json({msg: 'ocorreu um erro contate o suporte', err}) 
        })
    }
}

///// retorna todos os clientes de uma massiva
exports.clientMassiveview = async (req, res) => {
    await prisma.client_massive.findMany({
        where: {
            status: "ativo",
        },
        include: {
            massive: true,
            massive: {
                include: {
                    city: true,
                }
            }
        }
    }).then((response) => {
        res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
    res.status(200).json('response')
}