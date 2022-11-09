//onst io = require("../server")
const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const indexRepository = require("../repositories/index.repository")
const UserService = require("./User.service")
const { exec } = require('child_process')
const path = require("path");
 var shell_exec = require('shell_exec').shell_exec;
const prisma = new PrismaClient({ 
    datasources: { 
      db: { 
       url: process.env.DATABASE_URL_INTRNAL
    } } });
 const shellExec = require('shell-exec')
    /// retorna os dados do mapa de area
exports.index = async () => {
    return indexRepository.index()
} 

/// retorna os dados do mada de area de uma data especifica
exports.search = async (startDate, endDate, citiesInt) => {
    if (endDate < startDate){
        // a data incial não pode ser mair que a final
        return {status: 406, msg: "periodo inválido", response:[]} 
    }else{      
         return await indexRepository.search(startDate, endDate ,citiesInt)
    }   
}


exports.create = async (city, colaborator, type, period, date, userId) => {
    const user = await indexRepository.findBeforeCreate(city, colaborator, date)
    const myUser = await UserService.findUserById(userId)
    console.log(userId)
    if (myUser.response.department.id >= 14 ){

    console.log(user, new Date(date))
    if (user.response != null){
        return { status: 500, msg: "o tecnico já está no local neste dia"}
    }else{
        console.log(new Date(date),  new Date())
        if (new Date(date) < new Date(new Date().toLocaleDateString("en-US"))){
            return { status: 500, msg: "viagens no tempo não são possíveis ainda"} 
        }else{
           return await indexRepository.create(city, colaborator, period, date, type) 
        }
        

        }
    }else{
        return { status: 401, msg: "você não tem permissão para este tipo de operação"}
    }
}

exports.alertCreate = async (userId, description,date, city) => {
    const myUser = await UserService.findUserById(userId)
    return  await indexRepository.alertCreate(userId, description, date, city)

}



exports.createMany = async (userId, colaborator, startDate, endDate, weekDays, type, period, city) => {
    const myUser = await UserService.findUserById(userId)
const options = { weekday: 'short' };

let response = []
let msg = ''
    for(let i = 0; i<1;){
        if (new Date(startDate).toDateString() == new Date(endDate).toDateString()){
            i++
            return {status: 200, response:  response, msg: msg}
           
        }else{
        const thisIsTheDay = weekDays.filter((item)=> item == new Date(startDate).toLocaleDateString('pt-BR', options).slice(0,3))
            console.log(thisIsTheDay.length,new Date(startDate).toLocaleDateString('pt-BR', options).slice(0,3), weekDays)
        if (thisIsTheDay.length > 0){
            //let  _response = await indexRepository.create(city, colaborator, period, startDate, type)
            
            let  _response = await this.create(city, colaborator, type, period, startDate, userId)
            startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() +1 ))
            if (_response.status == 500){
                msg = "tarfa concluida com alguns erros"
            }
            response.push(_response)
        }else{
            startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() +1 ))
         }}
         
     
    }

 //return {status: 200, response:  }

}



exports.cities_seach = async (userId, data) => {
    const myUser = await UserService.findUserById(userId)
    return  await indexRepository.cities_seach(data)

}


exports.editType = async (userId, id, type) => {
    const myUser = await UserService.findUserById(userId)
    const userIndWork =  await indexRepository.findUserInWork(id)
    if (myUser.response.department.id > 14){
        if (type == 1 && userIndWork.response.periodo == 2){
            return { status: 500, msg: "você não tem permissão para editar"}
        }else if(type == 2 && userIndWork.periodo == 2) {
            return { status: 500, msg: "você não tem permissão para editar"}
        }else{
            return await indexRepository.EditType(id, type)
        }
         
    }else {
        return { status: 500, msg: "você não tem permissão para editar"}
    }  
}

exports.Update = async (userId, id, city, date) => {
    const myUser = await UserService.findUserById(userId)
    const userIndWork =  await indexRepository.findUserInWorkByDate(id, date)
    if (userIndWork.response.length > 0){
        return { status: 500, msg: "o Técnico já esta no local"}
    }
    if (myUser.response.department.id > 14){
        console.log(userIndWork)
            return await indexRepository.Update(id, city, date)
    }else {
        return { status: 500, msg: "você não tem permissão para editar"}
    }  
}



exports.EditPeriod = async (userId, id, period) => {
    console.log(period)
    const myUser = await UserService.findUserById(userId)
    const userIndWork =  await indexRepository.findUserInWork(id)
    if (myUser.response.department.id > 14){
        if (period == 2 && userIndWork.response.type == 1 || userIndWork.response.type == 2){
            return { status: 500, msg: "você não tem permissão para editar"}
        }else{
             return await indexRepository.EditPeriod(id, period)
        }

       
    }else {
        return { status: 500, msg: "você não tem permissão para editar"}
    }
}


exports.delete = async (id, _user) => {
    const user = await UserService.findUserByEmail(_user.email)
    if (user.response.department.id >= 14){
       return await indexRepository.delete(id)
    }else{ 
        return {status:401, msg: "Sem permissão", respoonse:[]}
        } 
} 


exports.teste = async (req, res) => {
    const create = await prisma.city.createMany({ 
        data: 
        [
        { "name": "ALTO CAPARAÓ"},
        { "name": "ALTO JEQUITIBA"},
        { "name": "ALEGRE"},
        { "name": "ANTONIO PRADO DE MINAS"},
        { "name": "BOM JESUS DO ITABAPOANA"},
        { "name": "BOM JESUS DO NORTE"},
        { "name": "CAIANA"},
        { "name": "CAPARAÓ"},
        { "name": "CARANGOLA"},
        { "name": "DIVINO DE SÃO LOURENÇO"},
        { "name": "DORES DO RIO PRETO"},
        { "name": "ESPERA FELIZ"},
        { "name": "GUAÇUÍ"},
        { "name": "MANHUMIRIM"},
        { "name": "NATIVIDADE"},
        { "name": "OURANIA"},
        { "name": "PEDRA DOURADA"},
        { "name": "PIRAPETINGA"},
        { "name": "PORCIUNCULA"},
        { "name": "QUERENDO"},
        { "name": "SÃO JOSE DO CALÇADO"},
        { "name": "TOMBOS"},
        { "name": "VARRE SAI"}
        ]
}).then((response) => {

    res.status(200).json(response)
}).catch((err) => {
    res.status(500).json({st: 0, msg: "ocoorreu um erro contate o suporte", err})
})
}




exports.login2 = async () => {
   
 
var link = await shell_exec(
`
curl -i 'https://synsuite.acesse.net.br/users/login' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Cache-Control: max-age=0' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: SYNSUITE=ka6jgpb7aerqve9h24db6tpnl1' \
  -H 'Origin: https://synsuite.acesse.net.br' \
  -H 'Referer: https://synsuite.acesse.net.br/users/login' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw 'data%5BUser%5D%5Blogin%5D=rodrigo.protazio&data%5BUser%5D%5Bpassword2%5D=14780310' \
  --compressed
`
);

let location = link.indexOf("Location:") + 10
	 let content = link.indexOf("Content-Length:")
	   link =  link.slice(location, content-2)

var cookie = await shell_exec(
    `curl -i '`+link+`' \
    -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
    -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
    -H 'Cache-Control: max-age=0' \
    -H 'Connection: keep-alive' \
    -H 'Cookie: SYNSUITE=ka6jgpb7aerqve9h24db6tpnl1' \
    -H 'Referer: https://synsuite.acesse.net.br/users/login' \
    -H 'Sec-Fetch-Dest: document' \
    -H 'Sec-Fetch-Mode: navigate' \
    -H 'Sec-Fetch-Site: same-origin' \
    -H 'Sec-Fetch-User: ?1' \
    -H 'Upgrade-Insecure-Requests: 1' \
    -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
    -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "Windows"' \
    --compressed
        `)


         location = cookie.lastIndexOf("Set-Cookie:") + 12
         content = cookie.lastIndexOf("expires") 
         cookie =  cookie.slice(location, content-2)

        return cookie



}




exports.getTecnicos = async () => {
    const cookie = await this.login2()
    
    let colaborators = await shell_exec(
        `
        curl 'https://synsuite.acesse.net.br/people/getDataTable' \
          -H 'Accept: application/json, text/javascript, */*; q=0.01' \
          -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
          -H 'Connection: keep-alive' \
          -H 'Content-Type: application/x-www-form-urlencoded' \
          -H 'Cookie: `+cookie+`' \
          -H 'Origin: https://synsuite.acesse.net.br' \
          -H 'Referer: https://synsuite.acesse.net.br/tasks_schedules/teamSchedule/4' \
          -H 'Sec-Fetch-Dest: empty' \
          -H 'Sec-Fetch-Mode: cors' \
          -H 'Sec-Fetch-Site: same-origin' \
          -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
          -H 'X-Requested-With: XMLHttpRequest' \
          -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
          -H 'sec-ch-ua-mobile: ?0' \
          -H 'sec-ch-ua-platform: "Windows"' \
          --data-raw 'sEcho=1&iColumns=1&sColumns=&iDisplayStart=0&iDisplayLength=162&mDataProp_0=Person.name&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&iSortCol_0=0&sSortDir_0=asc&iSortingCols=1&bSortable_0=true&sTypes=%7B%7D&datatable=%7B%22fields%22%3A%5B%22Person.name%22%2C%22Person.id%22%2C%22Person.name_2%22%5D%2C%22searchFields%22%3A%5B%22Person.name%22%2C%22Person.name_2%22%5D%2C%22conditions%22%3A%7B%22Person.id%22%3A%5B%2212%22%2C%2221%22%2C%2228%22%2C%2234%22%2C%2240%22%2C%2243%22%2C%2248%22%2C%2249%22%2C%2251%22%2C%2255%22%2C%2259%22%2C%2262%22%2C%2263%22%2C%2284%22%2C%2285%22%2C%2215066%22%2C%2288%22%2C%2289%22%2C%2292%22%2C%2293%22%2C%2295%22%2C%2296%22%2C%2297%22%2C%22149100%22%2C%2298%22%2C%22101%22%2C%22102%22%2C%22103%22%2C%22107%22%2C%22109%22%2C%22110%22%2C%22112%22%2C%22113%22%2C%22114%22%2C%22115%22%2C%22118%22%2C%22123%22%2C%22124%22%2C%22128%22%2C%22130%22%2C%22136%22%2C%22140%22%2C%22146%22%2C%22148%22%2C%22152%22%2C%22222%22%2C%22223%22%2C%221118%22%2C%222438%22%2C%228111%22%2C%228189%22%2C%228246%22%2C%228995%22%2C%2211999%22%2C%2220200%22%2C%2223234%22%2C%2227496%22%2C%2229426%22%2C%2232097%22%2C%2235127%22%2C%2235363%22%2C%22131302%22%2C%22150003%22%2C%22133774%22%2C%22134446%22%2C%22134451%22%2C%22134736%22%2C%22134899%22%2C%22134903%22%2C%22134905%22%2C%22135188%22%2C%22136967%22%2C%22139567%22%2C%22140678%22%2C%22141504%22%2C%22143794%22%2C%22145626%22%2C%22146303%22%2C%22147337%22%2C%22148005%22%2C%22148921%22%2C%22148729%22%5D%2C%22Person.status%22%3A1%2C%22Person.deleted%22%3Afalse%7D%7D' \
          --compressed
        `)
        
        try{
            return JSON.parse(colaborators)
        }catch(err){
        return err
        }
}





exports.getTecnicos = async () => {
    const cookie = await this.login2()
    
    let colaborators = await shell_exec(
        `
        curl 'https://synsuite.acesse.net.br/people/getDataTable' \
          -H 'Accept: application/json, text/javascript, */*; q=0.01' \
          -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
          -H 'Connection: keep-alive' \
          -H 'Content-Type: application/x-www-form-urlencoded' \
          -H 'Cookie: `+cookie+`' \
          -H 'Origin: https://synsuite.acesse.net.br' \
          -H 'Referer: https://synsuite.acesse.net.br/tasks_schedules/teamSchedule/4' \
          -H 'Sec-Fetch-Dest: empty' \
          -H 'Sec-Fetch-Mode: cors' \
          -H 'Sec-Fetch-Site: same-origin' \
          -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
          -H 'X-Requested-With: XMLHttpRequest' \
          -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
          -H 'sec-ch-ua-mobile: ?0' \
          -H 'sec-ch-ua-platform: "Windows"' \
          --data-raw 'sEcho=1&iColumns=1&sColumns=&iDisplayStart=0&iDisplayLength=162&mDataProp_0=Person.name&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&iSortCol_0=0&sSortDir_0=asc&iSortingCols=1&bSortable_0=true&sTypes=%7B%7D&datatable=%7B%22fields%22%3A%5B%22Person.name%22%2C%22Person.id%22%2C%22Person.name_2%22%5D%2C%22searchFields%22%3A%5B%22Person.name%22%2C%22Person.name_2%22%5D%2C%22conditions%22%3A%7B%22Person.id%22%3A%5B%2212%22%2C%2221%22%2C%2228%22%2C%2234%22%2C%2240%22%2C%2243%22%2C%2248%22%2C%2249%22%2C%2251%22%2C%2255%22%2C%2259%22%2C%2262%22%2C%2263%22%2C%2284%22%2C%2285%22%2C%2215066%22%2C%2288%22%2C%2289%22%2C%2292%22%2C%2293%22%2C%2295%22%2C%2296%22%2C%2297%22%2C%22149100%22%2C%2298%22%2C%22101%22%2C%22102%22%2C%22103%22%2C%22107%22%2C%22109%22%2C%22110%22%2C%22112%22%2C%22113%22%2C%22114%22%2C%22115%22%2C%22118%22%2C%22123%22%2C%22124%22%2C%22128%22%2C%22130%22%2C%22136%22%2C%22140%22%2C%22146%22%2C%22148%22%2C%22152%22%2C%22222%22%2C%22223%22%2C%221118%22%2C%222438%22%2C%228111%22%2C%228189%22%2C%228246%22%2C%228995%22%2C%2211999%22%2C%2220200%22%2C%2223234%22%2C%2227496%22%2C%2229426%22%2C%2232097%22%2C%2235127%22%2C%2235363%22%2C%22131302%22%2C%22150003%22%2C%22133774%22%2C%22134446%22%2C%22134451%22%2C%22134736%22%2C%22134899%22%2C%22134903%22%2C%22134905%22%2C%22135188%22%2C%22136967%22%2C%22139567%22%2C%22140678%22%2C%22141504%22%2C%22143794%22%2C%22145626%22%2C%22146303%22%2C%22147337%22%2C%22148005%22%2C%22148921%22%2C%22148729%22%5D%2C%22Person.status%22%3A1%2C%22Person.deleted%22%3Afalse%7D%7D' \
          --compressed
        `)
        
        try{
            return JSON.parse(colaborators)
        }catch(err){
        return err
        }
}


exports.getAgenda = async (id) => {
    const cookie = await this.login2()
    
     
    let colaborators = await shell_exec(
        `
        curl 'https://synsuite.acesse.net.br/tasks_schedules/getSchedules/`+id+`?start=1664074800&end=1667703600&_=1666496757067' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: `+cookie+`' \
  -H 'Referer: https://synsuite.acesse.net.br/tasks_schedules/teamSchedule/4' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --compressed
        `)
        
        try{
            return JSON.parse(colaborators)
        }catch(err){
        return err
        }
}



exports.login = async () => {
	
let link;
  return await exec(
	`curl -i 'https://synsuite.acesse.net.br/users/login' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Cache-Control: max-age=0' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: SYNSUITE=ka6jgpb7aerqve9h24db6tpnl1' \
  -H 'Origin: https://synsuite.acesse.net.br' \
  -H 'Referer: https://synsuite.acesse.net.br/users/login' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw 'data%5BUser%5D%5Blogin%5D=rodrigo.protazio&data%5BUser%5D%5Bpassword2%5D=14780310' \
  --compressed`
		 , async (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        
    }
    if (stderr) {
    }
		
   let location = stdout.indexOf("Location:") + 10
	 let content = stdout.indexOf("Content-Length:")
	   link =  stdout.slice(location, content-2)
			return await exec(
	`curl -i '`+link+`' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Cache-Control: max-age=0' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: SYNSUITE=ka6jgpb7aerqve9h24db6tpnl1' \
  -H 'Referer: https://synsuite.acesse.net.br/users/login' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --compressed`
		 , async (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        
    }
    if (stderr) {
        //console.log(`stderr: ${stderr}`);
    }
			 let location = stdout.lastIndexOf("Set-Cookie:") + 12
	 let content = stdout.lastIndexOf("expires") 
	  link =  stdout.slice(location, content-2)



 return await exec(
	`curl 'https://synsuite.acesse.net.br/people/getDataTable' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: `+link+`' \
  -H 'Origin: https://synsuite.acesse.net.br' \
  -H 'Referer: https://synsuite.acesse.net.br/tasks_schedules/teamSchedule/4' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw 'sEcho=1&iColumns=1&sColumns=&iDisplayStart=0&iDisplayLength=162&mDataProp_0=Person.name&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&iSortCol_0=0&sSortDir_0=asc&iSortingCols=1&bSortable_0=true&sTypes=%7B%7D&datatable=%7B%22fields%22%3A%5B%22Person.name%22%2C%22Person.id%22%2C%22Person.name_2%22%5D%2C%22searchFields%22%3A%5B%22Person.name%22%2C%22Person.name_2%22%5D%2C%22conditions%22%3A%7B%22Person.id%22%3A%5B%2212%22%2C%2221%22%2C%2228%22%2C%2234%22%2C%2240%22%2C%2243%22%2C%2248%22%2C%2249%22%2C%2251%22%2C%2255%22%2C%2259%22%2C%2262%22%2C%2263%22%2C%2284%22%2C%2285%22%2C%2215066%22%2C%2288%22%2C%2289%22%2C%2292%22%2C%2293%22%2C%2295%22%2C%2296%22%2C%2297%22%2C%22149100%22%2C%2298%22%2C%22101%22%2C%22102%22%2C%22103%22%2C%22107%22%2C%22109%22%2C%22110%22%2C%22112%22%2C%22113%22%2C%22114%22%2C%22115%22%2C%22118%22%2C%22123%22%2C%22124%22%2C%22128%22%2C%22130%22%2C%22136%22%2C%22140%22%2C%22146%22%2C%22148%22%2C%22152%22%2C%22222%22%2C%22223%22%2C%221118%22%2C%222438%22%2C%228111%22%2C%228189%22%2C%228246%22%2C%228995%22%2C%2211999%22%2C%2220200%22%2C%2223234%22%2C%2227496%22%2C%2229426%22%2C%2232097%22%2C%2235127%22%2C%2235363%22%2C%22131302%22%2C%22150003%22%2C%22133774%22%2C%22134446%22%2C%22134451%22%2C%22134736%22%2C%22134899%22%2C%22134903%22%2C%22134905%22%2C%22135188%22%2C%22136967%22%2C%22139567%22%2C%22140678%22%2C%22141504%22%2C%22143794%22%2C%22145626%22%2C%22146303%22%2C%22147337%22%2C%22148005%22%2C%22148921%22%2C%22148729%22%5D%2C%22Person.status%22%3A1%2C%22Person.deleted%22%3Afalse%7D%7D' \
  --compressed`
		 ,  async (error, stdout, stderr) => {
if (error) {
        console.log(`error: ${error.message}`);
        
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
	
			 link = await JSON.parse(stdout).aaData
             console.log(link)
             return link
		 })
			 
	
   
});
})
	 

	 
	
}




