const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = app => {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not register!' })
                }
                return bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return done(null, false, { message: 'Email ot Password incorrect.' })
                    }
                    return done(null, user)
                })
            })
            .catch(err => done(err, false))
    }))

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      }, (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const { name, email } = profile._json
        User.findOne({ email })
            .then(user => {
                if (user) return done(null, user)
                const randomPassword = Math.random().toString(36).slice(-8)
                bcrypt
                .genSalt(10)
                .then(salt => bcrypt.hash(randomPassword, salt))
                .then(hash => User.create({
                    name,
                    email,
                    password: hash
                }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }))

    passport.serializeUser((user, done) => {
        // console.log(user)
        done(null, user.id)
        // done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}