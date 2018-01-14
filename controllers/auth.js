const User = require('../models/schemas/user')
const jwt = require('jwt-simple')
const config = require('../models/config')

exports.loginUser = (req, res, next) => {
	console.log("5")
	if (!req.body.email) {
		return res.status(400).send('No email')
	}
	if (!req.body.password) {
		return res.status(400).send('No password')
	}
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) return next(err)
		if (!user) return res.status(400).send('No user with that email')

		user.comparePassword(req.body.password, (err, isMatch) => {
			if (err) return next(err)
			if (!isMatch)
				return res.status(401).send('Invalid password')

			const payload = {
				id: user._id,
				email: user.email,
				name: user.name
			}
			if (user.isAdmin) payload.isAdmin = true

			const token = jwt.encode(payload, config.secret)
			user.token = token
			user.save((err) => {
				if (err) return next(err)
				return res.json({ token })
			})
		})
	})
}

exports.adminRequire = (req, res, next) => {
	return res.sendStatus(501)
}

function validateToken(req, res, next, options) {
	const token = req.headers['x-access-token'] || req.body.token || req.query.token
	if (!token) return res.status(403).send('Admin required')

	let decoded
	try {
		decoded = jwt.decode(token, config.secret)
	}	catch(err) {
		return res.status(403).send('Failed to authenticate token')
	}

	if (options.adminRequired && !decoded.isAdmin) {
		return res.status(403).send('Admin required')
	}

	User.findById(decoded.id, (err, user) => {
		if (err) return next(err)
		if (!user) return res.status(403).send('Invalid id in token')
		if (token !== user.token) return res.status(403).send('Invalid token')

		if (decoded.isAdmin != user.isAdmin) return res.status(403).send('Invalid token, possible expired')

		next()
	})
}