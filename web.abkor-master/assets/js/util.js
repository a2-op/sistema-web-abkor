export default class Util {
	constructor(self) {
		this._self = self
	}

	get self() {
		return this._self
	}

	set self(val) {
		this._self = val
	}

	clonex(source, dest) {
		let prop
		if (source === null || typeof source !== 'object') return source
		if (source.nodeName) return source.cloneNode(true)
		if (
			source.constructor === Date ||
			source.constructor === RegExp ||
			source.constructor === Function ||
			source.constructor === String ||
			source.constructor === Number ||
			source.constructor === Boolean
		) {
			return new source.constructor(source)
		}
		if (source.constructor !== Object && source.constructor !== Array)
			return source
		dest = dest || new source.constructor()
		for (prop in source) {
			dest[prop] = this.clonex(source[prop], dest[prop])
		}
		return dest
	}
	setHistory(event) {
		const prom = new Promise((resolve, reject) => {
			event.inactive = false
			this.requestApi(
				'/api/history',
				'POST',
				{},
				{
					command: 'REGISTER_HISTORY',
					transaction: event
				}
			)
				.then((resp) => {
					if (resp) {
						resolve(resp.Response)
					} else {
						reject(resp.Response)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
		return prom
	}
	getDateTime(format = 'dd-MM-yyyy', longdate = '') {
		const date = longdate !== '' ? new Date(longdate) : new Date()
		let hour = date.getHours()
		hour = (hour < 10 ? '0' : '') + hour
		let min = date.getMinutes()
		min = (min < 10 ? '0' : '') + min
		let sec = date.getSeconds()
		sec = (sec < 10 ? '0' : '') + sec
		const year = date.getFullYear()
		let month = date.getMonth() + 1
		month = (month < 10 ? '0' : '') + month
		let day = date.getDate()
		day = (day < 10 ? '0' : '') + day
		let dateResult = format.replace('dd', day)
		dateResult = dateResult.replace('MM', month)
		dateResult = dateResult.replace('yyyy', year)
		dateResult = dateResult.replace('hh', hour)
		dateResult = dateResult.replace('mm', min)
		dateResult = dateResult.replace('ss', sec)
		return dateResult
	}
	requestApi(purl, pmethod, pparams = {}, pdata = {}, redirect = '/') {
		const promise = new Promise((resolve, reject) => {
			const pheaders = {
				Authorization: `Bearer ${this._self.$store.state.token}`
			}
			this._self.$axios
				.$request({
					url: purl,
					method: pmethod,
					headers: pheaders,
					params: pparams,
					data: pdata
				})
				.then((resp) => {
					if (resp.status === 'ERROR') {
						this._self.message({
							title: 'Error',
							message: resp.message,
							type: 'error'
						})
					}
					resolve(resp)
				})
				.catch((err) => {
					if (err.response.status === 401) {
						if (this._self.delToken) {
							this._self.delToken()
						}
						this._self.$router.replace(redirect)
						resolve(err)
					} else if (err.response.status === 403) {
						this._self.message({
							title: 'Atención',
							message:
								'No esta autorizado para realizar esta acción',
							type: 'warn'
						})
						resolve(err)
					} else {
						reject(err)
					}
				})
		})
		return promise
	}
}
