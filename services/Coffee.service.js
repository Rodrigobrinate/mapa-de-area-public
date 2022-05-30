
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ datasources: {  db: { url: "mysql://root:123456@mysqldb:3306/mapa-de-area" } } });
exports.index = async (req, res) => {
   const city = await prisma.coffee.findMany({
       
        include: {
           
              user: true,

      }
    })
    res.json(city) 
}

exports.create = async (req, res) => {

  const usersCoffe = await prisma.coffee.findUnique({
    where: {
      id: parseInt(req.user.id)
    }
  })
  if (usersCoffe) {
    res.json({
      status: 1,
      message: 'Você já está café',
      date: usersCoffe.created_at.getTime(),
      auth: true
    })  } else {  
  const coffee = await prisma.coffee.create({
    data: {
      user_id: parseInt(req.user.id),
    }
  
  })
  
  return res.json({ dete: new Date()})
    }
}
 

exports.delete = async (req, res) => {
  let coffee = await prisma.coffee.findFirst({
    where: {
      user_id: parseInt(req.user.id)
    }
  })
   historic = await prisma.historic.create({
    data: {
      initial_date: coffee.created_at,
      finally_date: new Date(),
      user_id: parseInt(req.user.id),
    }})


  await prisma.coffee.delete({
    where: {
      id: parseInt(coffee.id)
}}) 

  coffee = await prisma.coffee.findMany({
    include: {
          user: true,
  }
})
  res.json(coffee)
}