const express =  require('express');
const router = express.Router();
require('dotenv').config({path: 'variaveis.env'});
const CarroController = require('./controllers/CarroController'); 
const jwt = require('jsonwebtoken');
const app = express();
const SECRET='mysecret'


//rotas

function verifyJWT(req, res, next){ //verificador do header de req
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token não recebido.' });
    
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar Token' });
      
    
      req.userId = decoded.id;
      next();
    });
}

router.post('/login',(req, res, next) => { //post login 
     
    
    if(req.body.user === 'admin' && req.body.password === '2471'){ //verifica usuário
      const id = 1;  
      const token = jwt.sign({ id }, SECRET, { //gera o token
        expiresIn: 300
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Não foi possível fazer Login!'});
});



router.get('/carros',verifyJWT, CarroController.buscarTodos);
router.get('/carro/:codigo', CarroController.buscarUm);
router.post('/carro/', CarroController.inserir);
router.put('/carro/:codigo', CarroController.alterar);
router.delete('/carro/:codigo', CarroController.excluir);


module.exports = router;