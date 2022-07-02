
const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
     url: process.env.DATABASE_URL_INTRNAL
  } } });

exports.index = async (req, res) => {
    const {id} = req.params
    console.log(id)
      const user = await prisma.user.findMany({
        orderBy: [{
              name: 'asc',
            }],
        where: { 
            department: '1'
            
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
        })
        res.json(user)
}

exports.update = async (req, res) => {
    const {escala_id, user_id, time, month, day} = req.body
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
        })
    /*    const user = await prisma.user.findMany({
            orderBy: [
                {
                  name: 'asc',
                },
            ],
            where: {
                department: '1'
            },
            select: {
                name:true,
                id:true,
                user_in_work: {
                    where: {
                        month: new Date().getMonth()+1
                    }
                }
            }
        })*/
        res.json('done') 

}


exports.create = async (req, res) => {
    const {month, time} = req.body



    if(req.user.department < 4){
        res.json({st: 0, msg: 'permisão negada'})
    }else{
        if(!month || !time){
            res.json({st: 0, msg: 'preencha todos os dados'})
        }else{
        for(var ud = 20; ud > 0; ud--){

            for(var day = 1; day < 32; day++){
                if (ud == 3 || ud ==4){
                        //users not exists
                }else{   
                    await prisma.user_in_work.create({
                            data: {
                                User_id: ud,
                                time: parseInt(month),
                                month: parseInt(time),
                                day: day   
                            } 
                        }).catch((response)=> {
                            res.json({st: 0, msg: 'ocorreu um erro, entre em contato com o administrador'})
                        })
                }
            }
        }
        res.json({st: 1, msg: 'mes adicionado com sucesso'})
        }
    }
         
}


exports.indexSuport = async (req, res) => {
    const {id} = req.params
    console.log(id)
      const user = await prisma.user.findMany({
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
        })
        
        res.json(user)
}

