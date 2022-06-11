const express = require('express')
const router = express.Router()
const IndexController = require('./controllers/Index.controller')
const LoginController = require('./controllers/Login.controller')
const RegisterController = require('./controllers/Register.controller')
const MassiveController = require('./controllers/Massive.controller')
const CofeeController = require('./controllers/Cofee.controller')
const jwtVerify = require('./middleware/jwtVerify')


router.get('/', jwtVerify, IndexController.index)
router.post('/login', LoginController.login)
router.post('/register', RegisterController.register)
router.get('/city',jwtVerify, IndexController.city)
router.get('/colaborator',jwtVerify, IndexController.colaborator)
router.post('/create',jwtVerify,  IndexController.create)
router.post('/search', jwtVerify, IndexController.search)
router.get('/teste', jwtVerify, IndexController.teste)
router.post('/delete', jwtVerify, IndexController.delete)
router.post('/createMassive', jwtVerify, MassiveController.createMassive)
router.get('/Massive',jwtVerify, MassiveController.massive)
router.get('/coffee', CofeeController.index)
router.get('/addCoffee',jwtVerify, CofeeController.create) 
router.get('/closeCofee',jwtVerify, CofeeController.delete)
router.post('/admCloseCofee',jwtVerify, CofeeController.admdelete)   
router.post('/createMassiveClient', jwtVerify, MassiveController.createClientMassive)
router.get('/clientMassive', jwtVerify, MassiveController.clientMassiveview)
//router.post('/recovery/password', Usercontroller.recoveryPassword)



router.get('/t', jwtVerify, (req, res) => {
    res.json(req.user)
})
module.exports = router 