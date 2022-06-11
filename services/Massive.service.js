

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();
exports.createMassive = async (req, res) => {
 
    const create = await prisma.massive.create({
        data: {
        description: req.body.description,
        returndate: new Date(req.body.returndate),
        type: req.body.type,
        user_id: parseInt(req.user.id),
        cidade_id: parseInt(req.body.city),
        date: new Date(req.body.date),
        type: req.body.type,
        status: "ativo",

}})
    res.json(create)
} 

exports.massive = async (req, res) => {
    const massive = await prisma.massive.findMany({
        where: {
            status: "ativo",
        },
        include: {
            city: true,
        }
    })
    res.json(massive)
}


exports.createClientMassive = async (req, res) => {

if (req.body.massive_id == 0 ) {
        res.json({
            status: 0,
            msg: "Massiva inválida"
        })
    }else if (req.body.problem == 0 ) {
        res.json({
            status: 0,
            msg: "problema inválido"
        })
    }
    
    else{

    
    const massive = await prisma.massive.findUnique({
        where: {
            id: parseInt(req.body.massive_id),
        },
        include: {
            city: true,
        } 
    })

    
    const clientMassive = await prisma.client_massive.create({
            data: {
                massive_id: parseInt(req.body.massive_id),
                problem: req.body.problem,
                name: req.body.name,
                city_id:  parseInt(massive.city.id),
                user_id: parseInt(req.user.id), 
                status: "ativo", 
            }
        })
        if (clientMassive) {
            return res.status(200).json({st: 1, msg: 'Cliente cadastrado com sucesso'})
        } else {
            return res.status(400).json({st: 0, msg: 'Erro ao cadastrar cliente'})
        }
    res.json(massive)
    }
}


exports.clientMassiveview = async (req, res) => {
    const clientMassive = await prisma.client_massive.findMany({
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
    })
    res.json(clientMassive)
}