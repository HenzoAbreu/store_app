const ValidationContract = require('../validators/fluent-validator')
const repository = require("../repositories/customer-repository")
const md5 = require('md5')
const authService = require('../services/auth-service')

exports.post = async(req,res,next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, "O nome deve ter no minimo 3 caracteres")
    contract.isEmail(req.body.email, "e-mail invalido")
    contract.hasMinLen(req.body.password, 6, "A senha deve ter no minimo 6 caracteres")
     
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    
    try{
     await repository.create({
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password + process.env.SALT_KEY),
        roles: ["user"]
     });


     res.status(201).send({
         message: 'Cliente cadastrado!!'
     });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisicao",
        })
    }
}
 exports.authenticate = async(req,res,next) => {
   try{
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + process.env.SALT_KEY)

        });
        if (!customer) {
            res.status(404).send({
                message: 'Usuario ou senha invalidos'
            });
            return;
        }
        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email, 
            name: customer.name
        })

        res.status(201).send({
         token: token,
         data: {
             email:customer.email,
             name: customer.name
         }
        });
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar sua requisicao",
        })
    }
 }

 exports.refreshToken = async(req,res,next) => {
    try{
        const token = req.body.token || req.query.token || req.headers["x-access"];
        const data = await authService.decodeToken(token);

         const customer = await repository.getById(data.id);
         if (!customer) {
             res.status(404).send({
                 message: 'Usuario ou senha invalidos'
             });
             return;
         }
         const tokenData = await authService.generateToken({
             id: customer._id,
             email: customer.email, 
             name: customer.name
         })
 
         res.status(201).send({
          token: token,
          data: {
              email:customer.email,
              name: customer.name
          }
         });
     } catch (e) {
         res.status(500).send({
             message: "Falha ao processar sua requisicao",
         })
     }
  }