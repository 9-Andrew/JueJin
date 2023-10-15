let express = require('express')
let router = express.Router()
let interactionHandler=require('../routes_handler/interaction.js')

router.get('/add_view',interactionHandler.getAddView)
router.get('/is_like',interactionHandler.getIsLike)
router.get('/add_like',interactionHandler.getAddLike)
router.get('/delete_like',interactionHandler.getDeleteLike)
router.get('/is_star',interactionHandler.getIsStar)
router.get('/add_star',interactionHandler.getAddStar)
router.get('/delete_star',interactionHandler.getDeleteStar)
router.get('/is_follow',interactionHandler.getIsFollow)
router.get('/add_follow',interactionHandler.getAddFollow)
router.get('/delete_follow',interactionHandler.getDeleteFollow)

router.get('/follow_users',interactionHandler.getFollowListByUserId)
router.get('/followed_users',interactionHandler.getFollowedListByUserId)

module.exports=router