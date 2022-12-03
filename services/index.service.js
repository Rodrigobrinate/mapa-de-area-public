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
 const shellExec = require('shell-exec');
const { parse } = require('path');
const { ideahub } = require('googleapis/build/src/apis/ideahub');
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
 

exports.logs = async (page) => {
    return await indexRepository.logs(page)
}

exports.create = async (city, colaborator, type, period, date, userId) => {
    console.log('executou create')
    const user = await indexRepository.findBeforeCreate(city, colaborator, date)
    const myUser = await UserService.findUserById(userId)
    const  colaborator_added = await UserService.findUserById(colaborator)
    const cidade = await indexRepository.findCityById(parseInt(city))
   // console.log(userId)
    if (myUser.response.department.id >= 14 ){

    //console.log(user, new Date(date))
    if (user.response != null){
        return { status: 500, msg: "o tecnico já está no local neste dia"}
    }else{
        //console.log(new Date(date),  "new Date: "+new Date())
        if (new Date(date).toLocaleDateString("en-US", { timeZone: 'America/Sao_Paulo' }) < new Date(new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).toLocaleDateString("en-US"))){
            return { status: 500, msg: "você não pode adicionar um técnico em dias anteriores"} 
        }else{
        if (period == 2 && type == 1 || period == 2 && type == 2){
            return { status: 500, msg: "não é possívle adicionar um técnico de instalação a noite"} 
        }else{
            return await indexRepository.create(cidade, colaborator_added,myUser,city, colaborator, period, date, type) 
        }

           
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
 console.log( "executou aqui")
let response = []
let msg = ''
    for(let i = 0; i<1;){
        if (new Date(startDate).toDateString() == new Date(new Date(endDate).setDate(new Date(endDate).getDate() +1)).toDateString()){
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
    const userAdded = await UserService.findUserById(userIndWork.response.User_id)

    const cidade = await indexRepository.findCityById(userIndWork.response.city_id)

    if(userIndWork.response.type != type) {

    
    if (myUser.response.department.id >= 14){
        if (type == 1 && userIndWork.response.periodo == 2){
            return { status: 500, msg: "você não tem permissão para editar"}
        }else if(type == 2 && userIndWork.periodo == 2) {
            return { status: 500, msg: "você não tem permissão para editar"}
        }else{
            return await indexRepository.EditType(
                myUser, 
                userIndWork.response.type, 
                cidade,
                userAdded,
                id, 
                type)
        }
         
    }else {
        return { status: 500, msg: "você não tem permissão para editar"}
    }  }else {
        console.log(userIndWork.response.type == type)
        return { status: 200, msg: "você não tem permissão para editar"}
    }
}

exports.Update = async (userId, id, city, date) => {
    const myUser = await UserService.findUserById(userId)
    const userIndWork =  await indexRepository.findUserInWork(id)

    const Oldercity =  await indexRepository.findCityById(userIndWork.response.city_id)
    const userAdded = await UserService.findUserById(userIndWork.response.User_id)
    city = await indexRepository.findCityById(city)

        
        const userIndWorkByNameAndDate =  await indexRepository.findUserInWorkByNameAndDate(userIndWork.response.user.id,city.response.id, date)
        console.log(userIndWorkByNameAndDate)
        if (userIndWorkByNameAndDate.response.length > 0){
            return { status: 500, msg: "o Técnico já esta no local"}
        }else{
 
      
    const userIndWorkByDate =  await indexRepository.findUserInWorkByDate(id, date)
    if (userIndWorkByDate.response.length > 0){
        return { status: 500, msg: "o Técnico já esta no local"}
    }
    if (myUser.response.department.id >= 14){ 

        
            return await indexRepository.Update(
                myUser, 
                userIndWork.response.date,
                Oldercity,
                userAdded,
                id,
                city,
                date)
    }else {
        return { status: 500, msg: "você não tem permissão para editar"}
    }    }
}



exports.EditPeriod = async (userId, id, period) => {
    console.log(period)
    const myUser = await UserService.findUserById(userId)
    const userIndWork =  await indexRepository.findUserInWork(id)
    const userAdded = await UserService.findUserById(userIndWork.response.User_id)
    const cidade = await indexRepository.findCityById(userIndWork.response.city_id)

    if(userIndWork.response.period != period){

    
    
    if (myUser.response.department.id >= 14){
        if (period == 2 && userIndWork.response.type == 1 || userIndWork.response.type == 2){
            return { status: 500, msg: "você não tem permissão para editar"}
        }else{
             return await indexRepository.EditPeriod(
                myUser, 
                userIndWork.response.period, 
                cidade,
                userAdded,
                id,
                period,
               
                )
        }

       
    }else {
        return { status: 500, msg: "você não tem permissão para editar"}
    }

}
}


exports.delete = async (id, _user) => {
    const user = await UserService.findUserByEmail(_user.email)
    const userInWork = await indexRepository.findUserInWork(id)
    console.log(userInWork)
    const userAdded = await UserService.findUserById(userInWork.response.User_id)
    const cidade = await indexRepository.findCityById(userInWork.response.city_id)

    if (user.response.department.id >= 14){
       return await indexRepository.delete(user,userAdded,cidade,userInWork.response.date, id)
    }else{ 
        return {status:401, msg: "Sem permissão", respoonse:[]}
        } 
} 

exports.findAlertById = async (id) => {
    return await indexRepository.findAlertById(id)
}


exports.alertUpdate = async (description,id) => {


   const alerts =  this.findAlertById(id)
   if( new Date(alerts.respoonse).toLocaleDateString("en-US") < new Date().toLocaleDateString("en-US")){
    return {status:401, msg: "você não pode editar esta informação", respoonse:[]}
    }else {
        return await indexRepository.alertUpdate(id, description)
    }
}


exports.alertDelete = async (id,) => {
    const alerts =  this.findAlertById(id)
   if( new Date(alerts.respoonse).toLocaleDateString("en-US") < new Date().toLocaleDateString("en-US")){
    return {status:401, msg: "você não pode editar esta informação", respoonse:[]}
    }else {
        return await indexRepository.alertDelete(id)
    }
}



