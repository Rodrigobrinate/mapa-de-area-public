require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient({ datasources: { db: { url: "mysql://root:123456@mysqldb:3306/mapa-de-area" } } });


exports.login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    console.log(req.body)
    if(!email || !password) {
        return res.json({
            msg: 'preencha todos os campos',
            st: 0
        })
    }else{
    const user = await prisma.user.findUnique({
        where: {
          email: email,
        }
      })

      const verifyPassword = bcrypt.compareSync(password, user.password)
        if (!user || !verifyPassword) {
            return res.json({ 
                st: 0,
                msg: 'usuário ou senha inválidos'
            })
        }else{
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name,
                accessLevel: user.access_level,
                department: user.department
            }, process.env.SECRET, {
                expiresIn: '24h'
            })
            return res.status(200).json({
                msg: 'Login successful',
                st: 1,
                token: token,
                name: user.name,
                id: user.id,
                accessLevel: user.access_level,
                department: user.department
               
            })
        }}
}
