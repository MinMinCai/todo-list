const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

router.get('/', (req, res) => {
  const userId = req.user._id
  // Todo.find({ userId: userId })
  Todo.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(todos => res.render('index', { todos })) // 將資料傳給 index.hbs
    .catch(error => console.log(error))
})

module.exports = router