const express = require('express')
const router = express.Router()

const users = require('../controllers/users')
const items = require('../controllers/items')
const auth = require('../controllers/auth')


/*=============================================
=            Routes for users
=============================================*/
router.route('/users')
  .get(users.getAllUsers)

router.route('/users/student')
  .post(users.createStudent)

router.route('/users/admin')
  .post(users.createAdmin)

router.route('/users/:userId/id')
  .get(users.getUserById)
  .put(users.updateUser)
  .delete(users.deleteUser)

router.route('/users/:email/email')
  .get(users.getUserByEmail)

router.route('/users/:userId/paid')
  .put(users.markPendingPaid)

router.route('/users/:userId/delivered')
  .put(users.markPendingDelivered)

/*=============================================
=            Routes for items            
=============================================*/
router.route('/items')
  .get(items.getAllItems)
  .post(items.createItem)

router.route('/items/:itemId/id')
  .get(items.getItemById)
  .put(items.updateItem)
  .delete(items.deleteItem)

router.route('/items/stock')
  .get(items.getInStock)
  .post(items.createNewOrder)

router.route('/items/pending/delivered')
  .get(items.getUndeliveredPurchases)

router.route('/items/pending/paid')
  .get(items.getUnpaidPurchases)

/*=============================================
=            Routes for admins           
=============================================*/

router.route('/login')
  .post(auth.loginUser)

module.exports = router
