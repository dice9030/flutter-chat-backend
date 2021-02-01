
/*
    path : /api/login

*/

const {Router} = require('express');
const {crearUsuario,login, renewToken} = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const {check} = require('express-validator');
const {validarJWT} = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new',[
                    check('nombre','el nombre es obligatorio').not().isEmpty(),
                    check('password','el password es obligatorio').not().isEmpty(),
                    check('email','el email es obligatorio').isEmail(),
                    validarCampos
                    ],crearUsuario);



 // post: /
 //validar email, password

 router.post('/',[
                        check('password','el password es obligatorio').not().isEmpty(),
                        check('email','el email es obligatorio').isEmail(),
                     ],login);


//validarJWT
router.get('/renew',validarJWT, renewToken)

module.exports= router;