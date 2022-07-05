

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });
    exports.createMassive = async (req, res) => {
 
   await prisma.massive.create({
        data: {
        description: req.body.description,
        returndate: new Date(req.body.returndate),
        type: req.body.type,
        user_id: parseInt(req.user.id),
        cidade_id: parseInt(req.body.city),
        date: new Date(req.body.date),
        type: req.body.type,
        status: "ativo",
}}).then((response) => {
    res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
} 

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


exports.createClientMassive = async (req, res) => {
    if (req.body.massive_id == 0 ) {
            res.status(406).json({
                status: 0,
                msg: "Massiva inválida"
            })
        }else if (req.body.problem == 0 ) {
            res.status(406).json({
                status: 0,
                msg: "problema inválido"
            })
        }
    else{

    
        await prisma.massive.findUnique({
            where: {
                id: parseInt(req.body.massive_id),
            },
            include: {
                city: true,
            } 
        }).then(async (response) => { 

    
    await prisma.client_massive.create({
            data: {
                massive_id: parseInt(req.body.massive_id),
                problem: req.body.problem,
                name: req.body.name,
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