const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHendler')

module.exports.login = async function (req,res){
    const candidate = await User.findOne({email: req.body.email})
    if(candidate){
        const passwordResult = bcript.compareSync(req.body.password, candidate.password)
        if(passwordResult){
           const token = jwt.sign({
               email: candidate.email,
               userId: candidate._id
           },keys.jwt,{expiresIn: 60*60})
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: 'Пароли не совпадают'
            })
        }
    } else {
        res.status(401).json({
            message: "Данного пользователя не существует"
        })
    }
}

module.exports.register = async function(req,res){
    const candidate = await User.findOne({email: req.body.email})
    if(candidate){
        res.status(409).json({
            message: 'Такой email уже занят, попробуйте другой'
        })
    } else {
        const salt = bcript.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcript.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (e){
            errorHandler(res, e)
        }
    }
}
