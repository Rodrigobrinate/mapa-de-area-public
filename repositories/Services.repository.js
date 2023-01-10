const { PrismaClient } = require('@prisma/client');
const { response } = require('express');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_INTRNAL
        }
    }
});



exports.create = async (protocol, type, status, suport, user) => {
console.log(user)
    return await prisma.services.create({
        data: {
            protocol: protocol,
            incident_id: parseInt(type),
            status: status, 
            suport_id: parseInt(suport),
            user_id: parseInt(user.id) 
        }
    }).then((response) => { 
        return { response, status: 200, msg: "sucess" }
    })
}

exports.show = async (date, colaborator) => {
  // prisma.services.ra
    console.log( 'repository: ', date.replaceAll('/', '-'))
  
    date2 = date+ ' 23:59:59'
    date = date+ ' 00:00:00' 
        return await prisma.$queryRaw`
        SELECT t.name, COALESCE(COUNT(s.id), 0) as quantities
        FROM incidentType t
        left JOIN Services s ON t.id = s.incident_id
        and s.user_id = ${colaborator}
        AND s.created_at  BETWEEN ${date} AND ${date2}
        group by t.name
`
 

         
        .then((response) => {
            return { response, status: 200, msg: "sucess" }
        }) 

    
    
    }



    exports.show2 = async (startDate, endDate) => {
            return await prisma.$queryRaw`
            SELECT u.name as user_name, it.name,
            COALESCE((SELECT COUNT(*) FROM Services s WHERE s.user_id = u.id AND s.incident_id = it.id and s.created_at BETWEEN ${startDate} AND ${endDate}), 0) AS services_count
            FROM User u
            CROSS JOIN (SELECT * FROM incidentType) it
            WHERE u.department_id = 10 and  status = "Normal" 
            order by u.name, it.id
             `
              .then((response) => {
                  return { response, status: 200, msg: "sucess" }
              }) 
          }


          exports.show3 = async (startDate, endDate) => {
            //startDate = convertDateToSql(startDate)//+  ' 00:00:00' 
           // endDate = convertDateToSql(endDate)//+  ' 23:59:59'

            //console.log(startDate, endDate, convertDateToSql(endDate))
           return await prisma.$queryRaw`
            SELECT u.name as user_name, it.name, (it.value *
            COALESCE((SELECT COUNT(*) FROM Services s WHERE s.user_id = u.id AND s.incident_id = it.id and s.created_at BETWEEN ${startDate} AND ${endDate}), 0)) AS services_count
             FROM User u
            CROSS JOIN (SELECT * FROM incidentType) it
            WHERE u.department_id = 10 and status = "Normal" 
            order by u.name, it.id
             `
              .then((response) => {
                  return { response, status: 200, msg: "sucess" }
              }) 
          }


    exports.incidents = async () => {
   
        return await prisma.incidentType.findMany({
            orderBy: {
                id:  'asc'
            }
        }).then((response) => {
            return { response, status: 200, msg: "sucess" }
        })
    }


    function convertDateToSql(date){

        return ""+new Date(date).getFullYear() +"-"+ new Date(date).getMonth() < 10 ?  "0"+new Date(date).getMonth() : new Date(date).getMonth() + "-"+   new Date(date).getDay() < 10 ?  "0"+new Date(date).getDay() : new Date(date).getDay()+""
    }