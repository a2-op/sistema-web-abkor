// No considerar esta linea al ejecutar el script
const db = {}
// Inserting mail templates
db.templates.insert({
	code: 'RECOVER_PASSWORD',
	type: 'html',
	templateId: 'd-1ceb299f976d4b8c9a9f3afc57251c83',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.templates.insert({
	code: 'SEND_POLL',
	type: 'html',
	templateId: 'd-b450f9d0307a48e9b1a10126ef86cc8d',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

// Masters
// Inserting profiles
db.masters.insert({
	code: 'PROFILE',
	value1: 'USR',
	value2: 'Usuario',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'PROFILE',
	value1: 'ADM',
	value2: 'Administrador',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'PROFILE',
	value1: 'NUT',
	value2: 'Nutricionista',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'PROFILE',
	value1: 'PRO',
	value2: 'Producción',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

// Inserting states
db.masters.insert({
	code: 'STATE',
	value1: 'active',
	value2: 'Activo',
	value3: '0',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'STATE',
	value1: 'inactive',
	value2: 'Inactivo',
	value3: '1',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

// Inserting intervals
db.masters.insert({
	code: 'INTERVAL',
	value1: 'DAY',
	value2: 'Dias',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'INTERVAL',
	value1: 'WEEK',
	value2: 'Semanas',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'INTERVAL',
	value1: 'MONTH',
	value2: 'Meses',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'INTERVAL',
	value1: 'YEAR',
	value2: 'Años',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

// Inserting types aditionals
db.masters.insert({
	code: 'TYPEADDAMOUNT',
	value1: 'Porcentaje',
	value2: '%',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.masters.insert({
	code: 'TYPEADDAMOUNT',
	value1: 'Soles',
	value2: 'S/',
	value3: '',
	value4: '',
	value5: '',
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

// Routes
// Inserting permissions
// Users
db.routes.insert({
	code: 'USR01',
	profile: 'USR',
	name: 'Social',
	path: '/account/social',
	icon: 'fas fa-hashtag',
	level: '1',
	children: [],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.routes.insert({
	code: 'USR02',
	profile: 'USR',
	name: 'Finanzas',
	path: '/account/finance',
	icon: 'fas fa-money-check-alt',
	level: '1',
	children: [],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.routes.insert({
	code: 'USR03',
	profile: 'USR',
	name: 'Pedidos',
	path: '/account/orders',
	icon: 'fab fa-product-hunt',
	level: '1',
	children: [],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.routes.insert({
	code: 'USR04',
	profile: 'USR',
	name: 'Feedback',
	path: '/account/feedback',
	icon: 'fas fa-comments',
	level: '1',
	children: [],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

// Admin
db.routes.insert({
	code: 'ADM01',
	profile: 'ADM',
	name: 'Gestión de usuarios',
	path: '#',
	icon: 'fas fa-users',
	level: '1',
	children: [
		{
			code: 'ADM01#01',
			profile: 'ADM',
			name: 'Usuarios',
			path: '/admin/users',
			icon: 'fas fa-user',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM01#02',
			profile: 'ADM',
			name: 'Alertas',
			path: '/admin/alerts',
			icon: 'fas fa-exclamation-triangle',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM01#03',
			profile: 'ADM',
			name: 'Permisos',
			path: '/admin/permissions',
			icon: 'fas fa-user-shield',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM01#05',
			profile: 'ADM',
			name: 'Recordatorios',
			path: '/admin/reminders',
			icon: 'fas fa-stopwatch',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM01#06',
			profile: 'ADM',
			name: 'Anuncios',
			path: '/admin/advertisements',
			icon: 'fas fa-bell',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
db.routes.insert({
	code: 'ADM02',
	profile: 'ADM',
	name: 'Gestión de Ventas',
	path: '#',
	icon: 'fas fa-tag',
	level: '1',
	children: [
		{
			code: 'ADM02#01',
			profile: 'ADM',
			name: 'Planes',
			path: '/admin/plans',
			icon: 'fas fa-award',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM02#02',
			profile: 'ADM',
			name: 'Productos',
			path: '/admin/products',
			icon: 'fab fa-product-hunt',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM02#03',
			profile: 'ADM',
			name: 'Categorias',
			path: '/admin/categories',
			icon: 'fas fa-align-center',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM02#04',
			profile: 'ADM',
			name: 'Servicios',
			path: '/admin/services',
			icon: 'fas fa-concierge-bell',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM02#05',
			profile: 'ADM',
			name: 'Clientes',
			path: '/admin/clients',
			icon: 'fas fa-user',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM02#06',
			profile: 'ADM',
			name: 'Pedidos',
			path: '/admin/orders',
			icon: 'fab fa-product-hunt',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM02#07',
			profile: 'ADM',
			name: 'Citas',
			path: '/admin/appointments',
			icon: 'fab fa-calendar-check',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

db.routes.insert({
	code: 'ADM03',
	profile: 'ADM',
	name: 'Gestión Post-venta',
	path: '#',
	icon: 'fas fa-poll-h',
	level: '1',
	children: [
		{
			code: 'ADM03#01',
			profile: 'ADM',
			name: 'Encuestas',
			path: '/admin/polls',
			icon: 'fas fa-poll',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM03#02',
			profile: 'ADM',
			name: 'Comentarios',
			path: '/admin/comments',
			icon: 'fas fa-comments',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

db.routes.insert({
	code: 'ADM04',
	profile: 'ADM',
	name: 'SimpliRoute',
	path: '#',
	icon: 'fas fa-route',
	level: '1',
	children: [
		{
			code: 'ADM04#01',
			profile: 'ADM',
			name: 'Visitas',
			path: '/admin/visits',
			icon: 'fas fa-walking',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM04#02',
			profile: 'ADM',
			name: 'Optimización',
			path: '/admin/optimization',
			icon: 'fas fa-tachometer-alt',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

db.routes.insert({
	code: 'ADM05',
	profile: 'ADM',
	name: 'Configuración',
	path: '#',
	icon: 'fas fa-cog',
	level: '1',
	children: [
		{
			code: 'ADM05#01',
			profile: 'ADM',
			name: 'Plantillas de Correo',
			path: '/admin/templates',
			icon: 'fas fa-file-code',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'ADM05#02',
			profile: 'ADM',
			name: 'Portal Web',
			path: '/admin/web',
			icon: 'fas fa-window-restore',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

db.routes.insert({
	code: 'ADM06',
	profile: 'ADM',
	name: 'Reportes',
	path: '#',
	icon: 'fas fa-file',
	level: '1',
	children: [
		{
			code: 'ADM06#01',
			profile: 'ADM',
			name: 'Ingresos',
			path: '/admin/reports',
			icon: 'fas fa-file',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
// Nutritionist
db.routes.insert({
	code: 'NUT01',
	profile: 'NUT',
	name: 'Gestión de Pacientes',
	path: '#',
	icon: 'fas fa-procedures',
	level: '1',
	children: [
		{
			code: 'NUT01#01',
			profile: 'NUT',
			name: 'Calendario',
			path: '/nutritionist/calendar',
			icon: 'fas fa-calendar-day',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'NUT01#02',
			profile: 'NUT',
			name: 'Horarios',
			path: '/nutritionist/schedule',
			icon: 'fas fa-clock',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'NUT01#03',
			profile: 'NUT',
			name: 'Pacientes',
			path: '/nutritionist/patients',
			icon: 'fas fa-procedures',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})

db.routes.insert({
	code: 'NUT02',
	profile: 'NUT',
	name: 'Reportes',
	path: '#',
	icon: 'fas fa-file',
	level: '1',
	children: [
		{
			code: 'NUT02#01',
			profile: 'NUT',
			name: 'Seguimiento de pacientes',
			path: '/nutritionist/patiens-tracking',
			icon: 'fas fa-procedures',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
// Production
db.routes.insert({
	code: 'PRO01',
	profile: 'PRO',
	name: 'Gestión de Insumos',
	path: '#',
	icon: 'fas fa-pepper-hot',
	level: '1',
	children: [
		{
			code: 'PRO01#01',
			profile: 'PRO',
			name: 'Insumos',
			path: '/production/supplies',
			icon: 'fas fa-leaf',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		},
		{
			code: 'PRO01#02',
			profile: 'PRO',
			name: 'Producción',
			path: '/production/current-production',
			icon: 'fas fa-industry',
			level: '2',
			children: [],
			create_by: 'system',
			create_at: new Date(),
			inactive: false
		}
	],
	create_by: 'system',
	create_at: new Date(),
	inactive: false
})
