require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
        url: process.env.DATABASE_URL_INTRNAL,
    } } });

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if(!email || !password) {
        return res.json({msg: 'preencha todos os campos',st: 0})
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
