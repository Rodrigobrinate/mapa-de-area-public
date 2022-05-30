const coffeeService =  require('../services/Coffee.service')

 exports.index = (req, res) => {
    coffeeService.index(req, res)
}

    exports.create = (req, res) => {
    coffeeService.create(req, res)
}

exports.delete = (req, res) => {
    coffeeService.delete(req, res)
}