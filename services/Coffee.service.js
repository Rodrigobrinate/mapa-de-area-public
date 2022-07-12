
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });
 
  // busca os usuarios que estão no café de um horario especifico e de um mes especifico
exports.index = async (req, res) => {
  console.log(new Date().getDay())
   await prisma.coffee.findMany({
        include: {
              user: { 
                 select: {
                  name: true,
                  user_in_work:{
                    where: {
                      month: new Date().getMonth()+1,
                      day: new Date().getDay()+10,
                    },
                    select: {
                      time: true
                    }
                  }
                },
              }
      }  
    }).then((response) => {
        res.status(200).json(response)
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })

  /*  if (city.length != 0){ 
     // console.log(city)

    
    if (city[0].user.user_in_work.length == 0){
      console.log(new Date().getDay(), new Date().getMonth()+1,)
      city = []
    }
  
  }   */
    
} 

  // adiciona um usuario ao café
exports.create = async (req, res) => {
   await prisma.coffee.findMany({}).then(async (response) => {


  //verifica se não tem muitos usuarios no café
  if (response.length >= 3) {
    res.json({status: 0, msg: "espere um colaborador voutar do café"})
  }else{
   await prisma.coffee.findUnique({
      where: {
        id: parseInt(req.user.id)
      }
    }).then(async (response) => {
      // verifica se o usuario já está no café
      if (response) {
        res.json({
          st: 1,
          msg: 'Você já está café',
          date: response.created_at.getTime(),
          auth: true
        })
      }else {  
        await prisma.coffee.create({
          data: {
            user_id: parseInt(req.user.id),
          }
        }).then((response) => {
          res.json({st: 1,msg: 'Você foi adicionado ao café',date: response.created_at.getTime(),})
        }).catch((err) => {
          res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
        })}
    }).catch((err) => {
      res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })
}
}).catch((err) => {
  res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
})
}
 
// remove um usuario do café
exports.delete = async (req, res) => {
  await prisma.coffee.findFirst({
    where: {
      user_id: parseInt(req.user.id)
    }
  }).then(async (response) => {
   /*historic = await prisma.Historic_pause.create({
    data: {
      initial: new Date(coffee.created_at),
      final: new Date(),
      user_id: parseInt(req.user.id),
    }})*/


  await prisma.coffee.delete({
    where: {
      id: parseInt(response.id)
}}).then((response) => {
  res.status(200).json({status: 1,msg: "Usuario removido do café"})
})
.catch((err) => {
  res.status(500).json({msg: 'ocorreu um erro  ao sair do café contate o suporte', err})
})
  await prisma.coffee.findMany({
    include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
            }
          },
  }
}).then((response) => {
  res.status(200).json(response)
}).catch((err) => {
  res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
} )
}).catch((err) => {
  res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
})
}


/// adiministrador pode remover pessoas do café de qualquer horário
exports.admdelete = async (req, res) => {
  // verifica se o usuario é administrador
  if (parseInt(req.user.department) < 4) {
    res.status(401).json({status: 0,msg: "Você não tem permissão para deletar"})
  }else {
  await prisma.coffee.findFirst({
    where: {
      user_id: req.body.id + 0
    }
  }).then( async (response) => {
    
  /* historic = await prisma.Historic_pause.create({
    data: {
      initial: new Date(coffee.created_at),
      final: new Date(),
      user_id: parseInt(req.body.id),
    }})*/
  await prisma.coffee.delete({
    where: {
      id: parseInt(response.id)

}}).then((response) => {
  res.status(200).json({status: 1,msg: "Usuario removido do café"})
})
.catch((err) => {
  res.status(500).json({msg: 'ocorreu um erro  ao sair do café contate o suporte', err})
})
  await prisma.coffee.findMany({
    include: {
          user: {
            select: {
              name: true,
              email: true,
              id: true,
            }
          },
    }
  }).then((response) => {
    res.status(200).json(response)
  }).catch((err) => {
    res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
  } )
 })
}}