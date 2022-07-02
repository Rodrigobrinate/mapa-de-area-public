
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });
 
exports.index = async (req, res) => {

    
   let city = await prisma.coffee.findMany({
        include: {
         
              user: { 
                 select: {
                  name: true,
                  user_in_work:{
                    where: {
                      month: new Date().getMonth()+1,
                      day: new Date().getDay(),
                      time:  parseInt(req.params.id)
                    },
                    select: {
                      time: true
                    }
                  }
                },
               
                
              }
      }  
    })

    if (city.length != 0){ 
      console.log(city)

    
   /* if (city[0].user.user_in_work.length == 0){
      console.log(new Date().getDay(), new Date().getMonth()+1,)
      city = []
    }*/
  
  }   
    res.json(city) 
} 

exports.create = async (req, res) => {
  let coffee = await prisma.coffee.findMany({})
  if (coffee.length >= 3) {
    res.json({status: 0,msg: "espere um colaborador voutar do café"})
  }else{
    const usersCoffe = await prisma.coffee.findUnique({
      where: {
        id: parseInt(req.user.id)
      }
    })
  if (usersCoffe) {
    res.json({
      st: 1,
      msg: 'Você já está café',
      date: usersCoffe.created_at.getTime(),
      auth: true
    })  } else {  

  await prisma.coffee.create({
    data: {
      user_id: parseInt(req.user.id),
    }
  
  })
  
  return res.json({ date: new Date(),st: 1,msg: 'Você está no café',})}}
}
 

exports.delete = async (req, res) => {
  let coffee = await prisma.coffee.findFirst({
    where: {
      user_id: parseInt(req.user.id)
    }
  })
   historic = await prisma.Historic_pause.create({
    data: {
      initial: new Date(coffee.created_at),
      final: new Date(),
      user_id: parseInt(req.user.id),
    }})


  await prisma.coffee.delete({
    where: {
      id: parseInt(coffee.id)
}}) 
  coffee = await prisma.coffee.findMany({
    include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
            }
          },
  }
})
  res.json(coffee)
}
exports.admdelete = async (req, res) => {
  if (parseInt(req.user.department) < 4) {
    res.json({status: 0,msg: "Você não tem permissão para deletar"})
  }
  else {
  let coffee = await prisma.coffee.findFirst({
    where: {
      user_id: req.body.id + 0
    }
  })
   historic = await prisma.Historic_pause.create({
    data: {
      initial: new Date(coffee.created_at),
      final: new Date(),
      user_id: parseInt(req.body.id),
    }})
  await prisma.coffee.delete({
    where: {
      id: parseInt(coffee.id)

}}) 
  coffee = await prisma.coffee.findMany({
    include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
            }
          },
  }
})
  res.json(coffee)
}}