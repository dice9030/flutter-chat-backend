const { io } = require('../index');
const {comprobarJWT} = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado,grabarMensaje} = require('../controllers/socket');
// Mensajes de Sockets
io.on('connection', client => {
    // console.log('Cliente conectado');

    // console.log(client.handshake.headers['x-token'])
    // console.log(client.handshake.headers)
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']) ;
    //verificar autenticacion
    if(!valido) { return client.disconnect();}

    usuarioConectado(uid);


    //Ingresar al usuario a una sala en particular
    // sala global, client.id

    client.join( uid);

    // client.to(uid).emit('');

    //escuchar mensaje
    client.on('mensaje-personal', async(payload) => {
        //Guardar mensaje
        await grabarMensaje(payload);
        io.to(payload.para ).emit('mensaje-personal', payload);
    } );


    // console.log('cliente autenticado')
    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        // console.log('Cliente desconectado');
    });

    // client.on('mensaje', ( payload ) => {
    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // });


});
