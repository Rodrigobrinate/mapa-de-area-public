const jwt = require('jsonwebtoken');

 function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, msg: 'você precisa fazer login' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(401).json({ auth: false, msg: 'você precisa fazer login novamente ' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.user = decoded;
      next();
    });
}

module.exports = verifyJWT;