module.exports = (io) => {
	io.of('/user').on('connection', (socket) => {
		socket.emit('loggedIn', () => {
			console.log('Inicio Sesión')
		})
		socket.on('online', (username) => {
			socket.emit('online', username)
			console.log('Online => ', username)
		})
		socket.on('msg', (msg) => {
			io.emit('msg', msg)
			console.log(msg)
		})
		socket.on('disconnect', () => {
			console.log('disconnect')
		})
	})
}
