const ServicesRepository = require("../repositories/Services.repository")
const dateFns = require('date-fns');

exports.create = async (protocol, type, status, suport, user) => {

    return ServicesRepository.create(protocol, type, status, suport, user)
}


exports.show = async (startDate, endDate, colaborator) => {
let arr = [] 
    for (let i = 0; 
         new Date(startDate).getTime()   <= new Date(endDate).getTime(); i++){
            console.log(startDate+ "teste")
            //console.log('controlle', await ServicesRepository.show(dateFns.format(new Date(startDate), 'yyyy-MM-dd'), colaborator))
            arr.push( { status: 200, 
                 msg: 'usuário cadastrado com sucesso',
                 date: new Date(startDate),
                 response:  await (await ServicesRepository.show(dateFns.format(new Date(startDate), 'yyyy-MM-dd'), colaborator)).response}
        ) 
        startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1))
 
        if (new Date(startDate).getTime() > new Date(endDate).getTime()){
            return { status: 200, 
                msg: 'usuário cadastrado com sucesso',
                response:  arr}
        }
    }
    
}

exports.show2 = async (startDate, endDate) => {
    return ServicesRepository.show2(startDate, endDate)
        
    }



    exports.show3 = async (startDate, endDate) => {
        return ServicesRepository.show3(startDate, endDate)
            
        }



exports.incidents = async () => {

    return ServicesRepository.incidents()
} 