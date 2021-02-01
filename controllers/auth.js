
const { response } = require('express');
const {validationResult} = require('express-validator');
const bcrypt =  require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;
    try {
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'datos invalidos'
            });
        }
        const usuario = new Usuario(req.body);

        // Encriptar constraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();

        //Generar mi JTW
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
             usuario,
             token,
            msg: 'Crear usuario!!!!'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"error"
        });
    }   
}

const login = async (req, res = response) => {
   
    try {
        const {email, password} = req.body;        
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }



        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validarPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuarioDB.id)



        res.json({
            ok: true,
             usuario:usuarioDB,
             token,
            msg: 'Inicio sesion!!!!'
        });
   } catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:"error"
    });
   }
   
   
}


const renewToken = async(req,res= response) => {

    // const {email, password} = req.body;     
    const {uid } =  req;
    const usuarioDB = await Usuario.findById( uid);
    const token = await generarJWT(uid);

    res.json({
        ok: true,          
        msg: 'TOKEN',
        usuario: usuarioDB,
        token

    });
}

module.exports = {
    crearUsuario,login,renewToken
}