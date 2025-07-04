const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // const name = req.body.name
  // const email = req.body.email
  // const password = req.body.password
  // const confirmPassword = req.body.confirmPassword
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      // console.log('User already exists.')
      errors.push({ message: '這個 Email 已經註冊過了'})
       return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    return bcrypt
    .genSalt(10) // 複雜度10
    .then(salt => {
      // console.log('salt:', salt)
      return bcrypt.hash(password, salt)
    })
    .then(hash => {
      // console.log('hash:', hash)
      return User.create({
        name,
        email,
        password: hash
      })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
    
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    // const newUser = new User({
    //   name,
    //   email,
    //   password
    // })
    // newUser
    //   .save()
    //   .then(() => res.redirect('/'))
    //   .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router