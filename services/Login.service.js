require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs');
const { response } = require("express");
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
        url: process.env.DATABASE_URL_INTRNAL,
    }}});

exports.login = async (req, res) => {
    const { email, password } = req.body;
    //verifica se foi enviado o email e a senha
    if(!email || !password) {
        return res.status(406).json({msg: 'preencha todos os campos',st: 0})
    }else{
   await prisma.user.findUnique({
        where: {
          email: email,
        }
      }).then((response) => {
        //verifics se o usuario existe
      if (!response){
            return res.status(401).json({ 
                st: 0,
                msg: 'usuário ou senha inválidos' 
            })
        }else{
            const verifyPassword = bcrypt.compareSync(password, response.password)
            if (!verifyPassword) {
                return res.status(401).json({ 
                    st: 0,
                    msg: 'usuário ou senha inválidos'
                }) 
            }else{
                const token = jwt.sign({
                    id: response.id,
                    email: response.email,
                    name: response.name,
                    accessLevel: response.access_level,
                    department: response.department
                }, process.env.SECRET, {
                    expiresIn: '24h'
                })
                return res.status(200).json({
                    msg: 'Login successful',
                    st: 1,
                    token: token,
                    name: response.name,
                    id: response.id,
                    accessLevel: response.access_level,
                    department: response.department
                
                })
        }} 
    }).catch((err) => {
        res.status(500).json({msg: 'ocorreu um erro contate o suporte', err})
    })}
   
}



exports.recovery = async (req, res) => {
    //verifica se o usuario tem permissão para recuperar a senha
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

