
const ServicesService = require("../services/Services.service")



exports.create = async (req, res) => {
    const {protocol, type, status, suport} = req.body
    const user  = req.user
   // console.log(req.user)

   if (protocol.length < 3 || type == "0" || status == "0" || suport == "0"){
    res.status(406).json({ msg: "preencha os dados corretamente ", response: "preencha os dados corretamente " })
   }else {

    const response = await ServicesService.create(protocol, type, status, suport, user)
    res.status(response.status).json({ msg: response.msg, response: response.response })
   }

    

 

}



exports.show = async (req, res) => {
        let {startDate, endDate, colaborator} = req.body

        if (new  Date(startDate).getTime() >= new Date(endDate).getTime()){
            res.status(406).json({ msg: "data inválida", response: [] })
        }else{

    console.log(endDate)
    startDate = new Date(startDate).toLocaleDateString("en-US")
    endDate = new Date(endDate).toLocaleDateString("en-US")
    colaborator = parseInt(colaborator)

    const response = await ServicesService.show(startDate, endDate, colaborator)
    res.status(response.status).json({ msg: response.msg, response: response.response })
        }
}






exports.show2 = async (req, res) => {
    const {startDate, endDate} = req.body

    if (new Date(startDate).getTime() > new Date(endDate).getTime()){
        res.status(406).json({ msg: "a data inical deve ser menor que a data final", response: [] })
    }else{

const response = await ServicesService.show2(startDate, endDate)
res.status(response.status).json({ msg: response.msg, response: response.response })
    }

}


exports.show3 = async (req, res) => {
    const {startDate, endDate} = req.body
    if (new Date(startDate).getTime() > new Date(endDate).getTime()){
        res.status(406).json({ msg: "a data inical deve ser menor que a data final", response: [] })
    }else{
    const response = await ServicesService.show3(startDate, endDate)
    res.status(response.status).json({ msg: response.msg, response: response.response })
    }
    }

exports.incidents = async (req, res) => {

    const response = await ServicesService.incidents()
    res.status(response.status).json({ msg: response.msg, response: response.response })

}