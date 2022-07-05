require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs');
const { response } = require("express");
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
        url: process.env.DATABASE_URL_INTRNAL,
    } } });

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(406).json({msg: 'preencha todos os campos',st: 0})
    }else{
    const user = await prisma.user.findUnique({
        where: {
          email: email,
        }
      }).then((response) => {

      if (!user){
            return res.status(401).json({ 
                st: 0,
                msg: 'usuário ou senha inválidos'
            })
        }else{
            const verifyPassword = bcrypt.compareSync(password, user.password)
            if (!verifyPassword) {
                return res.status(401).json({ 
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
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })}
   
}



exports.recovery = async (req, res) => {

    if( req.user.department < 4){
        res.json({st: 0, msg: 'permissão negada'})
    }else {
        const {email, password} = req.body
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: password
            }
        }).then((response) => {
            res.json({st: 1, msg: 'senha alterada com sucesso'})
        }).catch((response) => {
            res.json({st: 0, msg: 'ocorreu um erro'})
        })
    }
  }

