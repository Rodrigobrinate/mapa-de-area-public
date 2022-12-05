const IdexService = require('../services/index.service')


 exports.index = (req, res) => {
    const response = IdexService.index()
    res.status(response.status).json({msg: response.msg, response: response.response})
}
exports.search = async (req, res) => {
    let {startDate, endDate, cities} = req.body

    if (!startDate || !endDate || cities.lenght <= 0){

    }else{
        //console.log(new Date(startDate), new Date(endDate))
      
        startDate = new Date(new Date(startDate))
        endDate = new Date(new Date(endDate))
        let citiesInt =    cities.map(function(item) {
            return parseInt(item, 10);
        });
         const response = await IdexService.search(startDate, endDate, citiesInt)
         res.status(response.status).json({msg: response.msg, response: response.response})
    }


    
}


exports.logs = async (req, res) => {
    const {page} = req.params
    const response = await IdexService.logs(page)
    res.status(response.status).json({msg: response.msg, response: response.response})
}


exports.alertCreate = async (req, res) => {
    const {description, date, city} = req.body

    if (city){

    
    const response = await IdexService.alertCreate(parseInt(req.user.id),description,date, city)
    res.status(response.status).json({msg: response.msg, response: response.response})
}else {

}

}


exports.createMany = async (req, res) => {
    const {colaborator, startDate, endDate, weekDays, type, period, city} = req.body
console.log("controller")
    const response = await IdexService.createMany(parseInt(req.user.id),colaborator, startDate, endDate, weekDays, type, period, city)
    res.status(response.status).json({msg: response.msg, response: response.response})


}


exports.cities_seach = async (req, res) => {
    const {data} = req.body

    const response = await IdexService.cities_seach(parseInt(req.user.id), data)
    res.status(response.status).json({msg: response.msg, response: response.response})


}
 


exports.EditType = async (req, res) => {
    const {id, type} = req.body
    const response = await IdexService.editType(parseInt(req.user.id),id, type)
   console.log(response)
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

}}


exports.alertUpdate =  async (req, res) => {
    console.log(req.body.description)
    const {description, id } =  req.body
    const response = await IdexService.alertUpdate(description, id)
    res.status(response.status).json({msg: response.msg, response: response.response})
    
}

exports.alertDelete = async (req, res) => {
    const {id} = req.params
    const response = await IdexService.alertDelete(id)
    res.status(response.status).json({msg: response.msg, response: response.response})
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
    res.status(406).json({ status: 0, msg: "selecione uma cidade " })
    } 
}







