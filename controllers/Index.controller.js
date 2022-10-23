const IdexService = require('../services/index.service')


 exports.index = (req, res) => {
    const response = IdexService.index()
    res.status(response.status).json({msg: response.msg, response: response.response})
}
exports.search = async (req, res) => {
    let {startDate, endDate, cities} = req.body

    if (!startDate || !endDate || cities.lenght <= 0){

    }else{
        endDate = new Date(new Date(endDate).toDateString('yyyy-mm-dd'))
        startDate = new Date(new Date(startDate).toDateString('yyyy-mm-dd'))

        let citiesInt =    cities.map(function(item) {
            return parseInt(item, 10);
        });
         const response = await IdexService.search(startDate, endDate, citiesInt)
         res.status(response.status).json({msg: response.msg, response: response.response})
    }


    
}

 


exports.EditType = async (req, res) => {
    const {id, type} = req.body
    const response = await IdexService.editType(parseInt(req.user.id),id, type)
   
    res.status(response.status).json({msg: response.msg, response: response.response})
}
exports.EditPeriod = async (req, res) => {
    const {id, period} = req.body
    console.log(req.body)
    const response = await IdexService.EditPeriod(parseInt(req.user.id),id, period)
    res.status(response.status).json({msg: response.msg, response: response.response})

}

exports.Update = async (req, res) => {
    const {city, date, id} = req.body
    const response = await IdexService.Update(parseInt(req.user.id),id, city, date)
    res.status(response.status).json({msg: response.msg, response: response.response})
}

exports.login = async (req, res) => {
    const response = await IdexService.getTecnicos() 
    res.status(200).json({ response: response})
}

exports.getAgenda = async (req, res) => {
    const {id} = req.params
    const response = await IdexService.getAgenda(id) 
    res.status(200).json({ response: response})
}



exports.create = async (req, res) => {
    const {city, colaborator, type, period, date } = req.body

    if (city == 0 || colaborator == 0 || type == 0 || period == 0 || date == "" ) {
        res.status(406).json({
            st: 0,
            msg: "preencha todos os campos"
        })
    }else{ 
   
    const response = await IdexService.create(city, colaborator, type, period, date, parseInt(req.user.id))
    res.status(response.status).json({msg: response.msg, response: response.response})

}
    
}
exports.teste = (req, res) => {
    IdexService.teste(req, res)
}
exports.delete = async (req, res) => {
    const {id} = req.body
    if (id){
        const response = await IdexService.delete(id, req.user)
   res.status(response.status).json({msg: response.msg, response: response.response})
    }else{

    } 
}
