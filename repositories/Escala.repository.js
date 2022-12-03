const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });



exports.create = async (colaborator,date,  time, department) => {

    return await prisma.user_in_work.create({
        data: {
            time: parseInt(time),
            User_id: parseInt(colaborator),
            
            date: new Date(new Date(date).toLocaleDateString('en-US')),
            department: department
        }
    }).then((response) => {

        
        return {status: 200, msg: "success", response:  response}
    }).catch((err) => {
        return {status: 500, msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", err}
        })
}  

exports.search = async (startDate, endDate, department) => {
console.log(department)
    return await prisma.user_in_work.findMany({
        where:{
            AND: [
                {
                    department: {
                        in: parseInt(department)
                    }
                },
                {
                  date:{
                    lte: new Date(new Date(new Date(endDate).setDate(new Date(endDate).getDate() +1)))
                  }},
                  {
                    date:{
                      gte: new Date(startDate)
                    }},
              ]
        },
        
        include: {
            user: {
                select: {
                name: true,
                id: true,
                }
            }
        }

    }).then((response) => {
        return {status: 200, msg: "success", response:  response}
    })
}  

exports.update = async (date, id, time, colaborator, department) => {

    return await prisma.user_in_work.update({
        where: {
            id: parseInt(id)
        },
        data: {
            time: parseInt(time),
            User_id: parseInt(colaborator),
            date: new Date(new Date(date).toLocaleDateString('en-US')),
            department: department
        }
    }).then((response) => {
        return {status: 200, msg: "success", response:  response}
    }).catch((err) => {
        return {status: 500, msg: "ocoorreu um erro ao cadastrar o técnico, contate o suporte", err}
        })
    }


        exports.delete = async (id) => {

            return await prisma.user_in_work.delete({
                where: {
                   id: parseInt(id)
                }
            }).then((response) => {
                return {status: 200, msg: "success", response:  response}
            }).catch((err) => {
                return {status: 500, msg: "ocoorreu um erro ao deltar o item, contate o suporte", err}
                })

            }