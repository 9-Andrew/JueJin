let express = require('express')
let router = express.Router()
let interactionHandler=require('../routes_handler/interaction.js')

router.get('/add_view',interactionHandler.getAddView)
router.get('/is_like',interactionHandler.getIsLike)
router.get('/add_like',interactionHandler.getAddLike)
router.get('/delete_like',interactionHandler.getDeleteLike)

module.exports=router