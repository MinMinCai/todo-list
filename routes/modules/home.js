const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

router.get('/', (req, res) => {
  // 拿到全部的 todo 資料
  Todo.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(todos => res.render('index', { todos })) // 將資料傳給 index.hbs
    .catch(error => console.log(error))
})

module.exports = router