
const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });


  // buscas os dados da escala para o call center
exports.index = async (req, res) => {
    const {id} = req.params
    if (id){
       await prisma.user.findMany({
        orderBy: [{
              name: 'asc',
            }],
        where: { 
            department: '4'
            
        },
            select: {
                name:true,
                id:true,
                user_in_work: {
                    where: {
                        month: parseInt(id)
                    }
                }
            }
        }).then((response) => {
            res.status(200).json(response)
        })
        .catch((err)=> {
            res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
        })
         }else{
            res.status(401).json({msg: 'ocorreu um erro, entre em contato com o administrador'})
         }
}


// atualiza a escala
exports.update = async (req, res) => {
    const {escala_id, user_id, time, month, day} = req.body
    // verifica se eo dados foram preenchidos
    if (escala_id && user_id && time && month && day){
        await prisma.user_in_work.update({
            where: {
                id:  parseInt(escala_id )
            },
                data: {
                    User_id: parseInt(user_id),
                    time: parseInt(time),
                    month: parseInt(month),
                    day: parseInt(day)  
                }
            }).then((response) => {
                res.status(200).json('salvo')
            })
            .catch((err)=> {
                res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
            })}
    else{
        res.status(401).json({msg: 'ocorreu um erro, entre em contato com o administrador'})

    }

    
       

}

/// cria a esca com um horário  fixo para um seguinte mes
exports.create = async (req, res) => {
    const {month, time} = req.body


/// verifica se o usuario tem permissão
    if(req.user.department < 4){
        res.json({st: 0, msg: 'permisão negada'})
    }else{
        if(!month || !time){
            res.status(500).json({st: 0, msg: 'preencha todos os dados'})
        }else{
            // percorra todos o colaboradores
        for(var ud = 1; ud > 0; ud--){
            // percorre todos os dias do mes
            for(var day = 1; day < 32; day++){
                if (ud == 3 || ud ==4){
                        //users not exists
                }else{   
                    /* para cada usario e cada dia do mês 
                    adiciona um horário de trabalho */
                    try {

                    console.log("try")
                    
               const create =      await prisma.user_in_work.create({
                            data: {
                                User_id: ud,
                                time: parseInt(time),
                                month: parseInt(month),
                                day: day   
                            } 
                        })

                        console.log(create)
                        //res.status(200).json({st: 0, msg: 'ocorreu um erro, entre em contato com o administrador', create })
                    
                    } catch(response) {
                            res.status(500).json({st: 0, msg: 'ocorreu um erro, entre em contato com o administrador', response})
                        } 
                }
            }
        }
        res.status(200).json({st: 1, msg: 'mes adicionado com sucesso'})
        }
    }
         
}

    // retorna os dados da escala do suporte 
exports.indexSuport = async (req, res) => {
    const {id} = req.params
    //verifica se o id foi preenchido
    if (id){
     await prisma.user.findMany({
        orderBy: [{
              name: 'asc',
            }],
        where: { 
            department: '2'
            
        },
            select: {
                name:true,
                id:true,
                user_in_work: {
                    where: {
                        month: parseInt(id)
                    }
                }
            }
        }).then((response) => {
            res.status(200).json(response)
        })
        .catch((err)=> {
            res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
        })
         }else{
            res.status(401).json({msg: 'ocorreu um erro, entre em contato com o administrador'})
         }
        
        
}

