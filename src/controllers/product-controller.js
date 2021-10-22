const ValidationContract = require('../validators/fluent-validator')
const repository = require("../repositories/product-repository")
const azure = require("azure-storage")
const guid = require("guid")

exports.get = async(req,res,next) => {
    try {
        var data = await repository.get()
            res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar requisicao"
        })
    }
}

exports.getById = async(req,res,next) => {
    try {
        var data = await repository.getById(req.params.id)
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: "Falha ao processar requisicao"
        })
    }
}

exports.getByTag = async(req,res,next) => {
    try {
        var data = await repository.getByTag(req.params.tag)
        
            res.status(200).send(data)
        } catch(e) {
            res.status(500).send({
                message: "Falha ao processar requisicao"
            })
        }
}




exports.post = async(req,res,next) => {
   let contract = new ValidationContract();
   contract.hasMinLen(req.body.title, 3, "O titulo deve ter no minimo 3 caracteres")
   contract.hasMinLen(req.body.slug, 3, "O slug deve ter no minimo 3 caracteres")
   contract.hasMinLen(req.body.description, 3, "A descricao deve ter no minimo 3 caracteres")
    
   if (!contract.isValid()) {
       res.status(400).send(contract.errors()).end();
       return;
   }
   
   try{
    //blob service
    const blobSvc = azure.createBlobService(process.env.USER_IMG_BLOB_CONNECTION_STRING);

    let filename = guid.raw().toString() + "jpg";
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    //salva a imagem

    await blobSvc.createBlockBlobFromText("productimages", filename, buffer, {
        contentType: type
    },function (error, result, response) {
        if (error) {
            filename = "default-product.png"
        }
    });

    await repository.create({
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        price: req.body.price,
        active: true,
        tags: req.body.tags,
        image: 'IMG URL' + filename
    })
    res.status(201).send({
        message: 'Produto cadastrado!!'
    })
   } catch (e) {
       res.status(500).send({
           message: "Falha ao processar sua requisicao"
       })
   }
}
   


exports.put = async(req, res ,next) => {
    try {
        await repository.update(req.params.id, req.body)
        res.status(200).send({
            message: "Produto atualizado"
        })
    } catch (e) {
        res.status(500).send({
            message: "Erro ao atualizar produto"
        })
    }
}


exports.delete = async(req, res ,next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            message: "Produto removido"
        })
    } catch (e) {
        res.status(500).send({
            message:"FALHA"
        })
    }
}
