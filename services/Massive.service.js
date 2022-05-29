

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ datasources: {  db: { url: "mysql://root:123456@mysqldb:3306/mapa-de-area" } } });


exports.createMassive = async (req, res) => {
 
    const create = await prisma.massive.create({
        data: {
        name: req.body.name,
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