// config.js
module.exports = {
	db: process.env.MONGODB_URI || 'mongodb://localhost:27017/getup',
	host: process.env.HOST || 'http://localhost',
	port: process.env.PORT || 4000,
	client: process.env.CLIENT || 'http://localhost:3000',
	token_secret: process.env.TOKEN_SECRET || 'sociallazy-access',
	token_admins: process.env.TOKEN_ADMINS || 'demo',
	bcrypt_salt_rounds: 12,
	cloudinaryuri:
		process.env.CLOUDINARY_URL ||
		'cloudinary://781444891113236:dFcH2VZmYevsg0qIrUFB0k3U_Xs@hbacb0hj8',
	cloudname: process.env.CLOUD_NAME || 'hbacb0hj8',
	cloudinarykey: process.env.CLOUDINARY_API_KEY || '781444891113236',
	cloudinarysecret:
		process.env.CLOUDINARY_API_SECRET || 'dFcH2VZmYevsg0qIrUFB0k3U_Xs',
	sendgrid_from: process.env.SENDGRID_FROM || 'no-reply@getup.com.pe',
	sendgrid_api_key:
		process.env.SENDGRID_APIKEY ||
		'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',
	// CREDENCIALES DE PAYU
	payu_api_key: process.env.PAYU_API_KEY || '5p2bueukgkjdeet8sl76r5lmr4Api',
	payu_api_login: process.env.PAYU_API_LOGIN || 'a856e6476b03085',
	payu_public_key:
		process.env.PAYU_PUBLIC_KEY || 'PKga647L6LxHC3216fZ5F3KTurId',
	payu_merchant_id: process.env.PAYU_MERCHANT_ID || '523678',
	payu_account_id: process.env.PAYU_ACCOUNT_ID || '525341 ',
	payu_uri_prod_payments:
		'https://api.payulatam.com/payments-api/4.0/service.cgi',
	payu_uri_test_payments:
		'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
	payu_uri_prod_queries:
		'https://api.payulatam.com/reports-api/4.0/service.cgi',
	payu_uri_test_queries:
		'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi',
	payu_uri_prod_subscriptions: 'https://api.payulatam.com/payments-api',
	payu_uri_test_subscriptions:
		'https://sandbox.api.payulatam.com/payments-api',
	payu_payment_attempts_delay: 1,
	payu_test: true,
	// CREDENCIALES DE CULQI
	culqi_public_key:
		process.env.CULQI_PUBLIC_KEY || 'pk_test_R8Io9ZZoTYD1Mynt',
	culqi_private_key:
		process.env.CULQI_PRIVATE_KEY || 'sk_test_VtUT8bbUmn6RU0SH',
	culqi_uri: 'https://api.culqi.com/v2',
	culqi_uri_secure: 'https://secure.culqi.com/v2',
	// SE ESTABLECE EL TIPO DE PASARELA
	payment_gateway: process.env.PAYMENT_GATEWAY || 'CULQI',
	// CREDENCIALES SIMPLIROUTE
	simpliroute_api_key:
		process.env.SIMPLIROUTE_API_KEY ||
		'cb7d323b6113785ce932764db456a08edd8b9522',
	simpliroute_uri: 'https://api.simpliroute.com/v1',
	STREAM_API_KEY: process.env.STREAM_API_KEY || '57zuuryycc37',
	STREAM_APP_SECRET:
		process.env.STREAM_APP_SECRET ||
		'55qz35g67vc24rxz9ssuxpfwtgz5mvcyzwaqfsmevh6fw6p5v8shxuscjy26jeph'
}
