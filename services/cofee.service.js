
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({ datasources: {  db: { url: "mysql://root:123456@mysqldb:3306/mapa-de-area" } } });
exports.index = async (req, res) => {
   const city = await prisma.cofee.findMany({
       
        include: {
            user_in_city: {
                
           include: {
              user: true,
          }
            }
      }
    })
    res.json(city)
}
