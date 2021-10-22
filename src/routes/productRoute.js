const express = require("express")
const router = express.Router()
const controller = require("../controllers/product-controller")
const authService = require('../services/auth-service')

router.get('/', controller.get)
router.get('admin/:id', controller.getById)
router.get('/search/:tag', controller.getByTag)
router.post('/add',authService.isAdmin, controller.post)
router.put('/update/:id',authService.isAdmin, controller.put)
router.delete('/delete',authService.isAdmin, controller.delete)




module.exports = router