
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });
 


exports.city = async () => {
   return await prisma.city.findMany({
    }).then((response) => {
        return {status: 200, msg:"success", response}
    }).catch((err) => {
       return {status: 500, msg: 'ocorreu um erro contate o suporte', err}
    }   )
} 