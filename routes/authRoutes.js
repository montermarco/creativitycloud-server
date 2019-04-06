const express = require('express');
const authRoutes = express.Router();  
const passport   = require('passport');
const bcrypt     = require('bcryptjs');
const User = require('../models/User');


/////////////////////////////////////////////////- POST Ruta Signup

authRoutes.post('/signup', async (req, res, next) => {

    const { username, password } = req.body

    //validations campos
    if(!username || !password){
        res.status(401).json({ message: 'Ingresa un nombre de usuario y una contraseña' });
        return;
    }
    if(password.length < 7){
        res.status(401).json({ message: 'Por seguridad el password debe contener al menos 8 caracteres' });
        return;
    }
   
    //validations info
    const user = await User.findOne({username});
      if(user !== null){
          return status(401).json({ message: 'El usuario ya existe' })
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        const aNewUser = new User({
          username,
          password: hashPass
        });
        
        try {
          const savedUser = await aNewUser.save()
          res.status(200).json(savedUser)
        } catch (error) {
           res.status(401).json({ message: 'Algo salio mal al guardar el usuario' }) 
        }
      }
  
});

/////////////////////////////////////////////////- POST Ruta Login

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
      if(err){
          res.status(500).json({message: 'Algo salio mal con la autenticación del usuario'})
          return;
      }
      if(!theUser){
          res.status(401).json(failureDetails);
          return;
      }

      req.login(theUser, (err) => {
          if(err){
              res.status(500).json({message: 'Algo salio mal al guardar la sesión'});
              return;
          }
          res.status(200).json(theUser);
      });
   })(req, res, next);
});

/////////////////////////////////////////////////- POST Ruta Logout

authRoutes.get('/logout', (req, res, next) => {
  req.logOut();
  res.status(200).json({message: 'Sessión terminada con exito'});
});

/////////////////////////////////////////////////- GET Ruta Loggedin

authRoutes.get('/loggedin', (req, res, next) => {
  if(req.isAuthenticated()){
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'No estas Autorizado, Inicia sessión para poder ingresar' });
});


module.exports = authRoutes;