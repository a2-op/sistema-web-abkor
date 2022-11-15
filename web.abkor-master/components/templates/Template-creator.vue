<template lang="pug">
	v-layout(row wrap)
		v-flex(xs12 sm6 md4 lg5 style="height: 600px;")
			v-container(grid-list-xl)
				v-tabs(v-model="tabs" centered)
					v-tabs-slider(color="primary")
					v-tab(href="#config") Configuración
					v-tab(href="#build") Construir
				v-tabs-items(v-model="tabs")
					v-tab-item(value="config")
						v-card
							v-expansion-panels(v-model="pConfigTemplate" multiple)
								v-expansion-panel
									v-expansion-panel-header
										div.body-2 Configuración de Plantilla
									v-expansion-panel-content
										v-card(flat)
											v-card-text
												v-layout(row wrap)
													v-flex(xs12)
														v-text-field(label="Asunto de Correo" v-model.trim="template.subject")
													v-flex(xs12)
														v-text-field(label="Preencabezado de correo" v-model.trim="template.preheader")
					v-tab-item(value="build")
						v-card
							v-expansion-panels(v-model="pBuildTemplate" multiple)
								v-expansion-panel
									v-expansion-panel-header
										div.body-2 Estilos de Modulo
									v-expansion-panel-content
										v-card(flat style="max-height: 200px; overflow: auto;")
											v-card-text
												span(v-if="!editRowModule") Haga clic en cualquier lugar de su plantilla para activar los estilos para ese módulo en particular. Puede agregar nuevos módulos arrastrándolos a su plantilla de la lista a continuación.
												v-layout(row wrap v-else)
													template(v-if="editedRowModule !== null")
														template(v-if="editedRowModule.column.type == 'button'")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.module.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Borde
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.module.border$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Texto
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.module.color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Ancho
																	v-flex(xs6)
																		v-text-field(label="Width" type="number" hint="0px, auto" persistent-hint v-model.trim="editedRowModule.column.styles.module.width")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Alto
																	v-flex(xs6)
																		v-text-field(label="Height" type="number" hint="0px, auto" persistent-hint v-model.trim="editedRowModule.column.styles.module.height")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		br
																		span Relleno
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.module.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.module.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.module.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.module.padding$left")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Borde Redondeado
																	v-flex(xs6)
																		v-text-field(label="Height" type="number" hint="0px, auto" persistent-hint v-model.trim="editedRowModule.column.styles.module.border$radius")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Ancho de borde
																	v-flex(xs6)
																		v-text-field(label="Border width" type="number" hint="0px" persistent-hint v-model.trim="editedRowModule.column.styles.module.border$width")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Espacio de letra
																	v-flex(xs6)
																		v-text-field(label="letter spacing" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.module.letter$spacing")
															v-flex(xs12)
																v-select(:items="weights" label="Font Weight" v-model="editedRowModule.column.styles.module.font$weight")
															v-flex(xs12)
																v-text-field(label="Texto boton" v-model.trim="editedRowModule.column.buttonText")
															v-flex(xs12)
																v-text-field(label="Url" v-model.trim="editedRowModule.column.buttonUri")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo del contenedor
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		span Relleno del contenedor
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$left")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Alineación
														template(v-if="editedRowModule.column.type == 'text'")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		br
																		span Relleno del contenedor
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$left")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		br
																		span Alto de linea
																	v-flex(xs6)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.line$height")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs12)
																		v-btn(@click="setObjectEditor(editedRowModule.column.text)") Editar Texto
														template(v-if="editedRowModule.column.type == 'column'")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		br
																		span Relleno del contenedor
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$left")
															template(v-if="editedRowModule.child !== null")
																template(v-if="editedRowModule.child.type == 'button'")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.module.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Borde
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.module.border$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Texto
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.module.color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Ancho
																			v-flex(xs6)
																				v-text-field(label="Width" type="number" hint="0px, auto" persistent-hint v-model.trim="editedRowModule.child.styles.module.width")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Alto
																			v-flex(xs6)
																				v-text-field(label="Height" type="number" hint="0px, auto" persistent-hint v-model.trim="editedRowModule.child.styles.module.height")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.module.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.module.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.module.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.module.padding$left")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Borde Redondeado
																			v-flex(xs6)
																				v-text-field(label="Height" type="number" hint="0px, auto" persistent-hint v-model.trim="editedRowModule.child.styles.module.border$radius")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Ancho de borde
																			v-flex(xs6)
																				v-text-field(label="Border width" type="number" hint="0px" persistent-hint v-model.trim="editedRowModule.child.styles.module.border$width")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Espacio de letra
																			v-flex(xs6)
																				v-text-field(label="letter spacing" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.module.letter$spacing")
																	v-flex(xs12)
																		v-select(:items="weights" label="Font Weight" v-model="editedRowModule.child.styles.module.font$weight")
																	v-flex(xs12)
																		v-text-field(label="Texto boton" v-model.trim="editedRowModule.child.buttonText")
																	v-flex(xs12)
																		v-text-field(label="Url" v-model.trim="editedRowModule.child.buttonUri")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo del contenedor
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.container.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno del contenedor
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$left")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Alineación
																template(v-if="editedRowModule.child.type == 'text'")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.container.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno del contenedor
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$left")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Alto de linea
																			v-flex(xs6)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.line$height")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs12)
																				v-btn(@click="setObjectEditor(editedRowModule.child.text)") Editar Texto
																template(v-if="editedRowModule.child.type == 'image'")
																	v-flex(xs12)
																		v-text-field(v-model.trim="editedRowModule.child.imageUri" label="Url Imagen")
																	v-flex(xs6)
																		v-text-field(v-model.trim="editedRowModule.child.styles.module.width" label="Ancho" hint="px, %" persistent-hint)
																	v-flex(xs6)
																		v-text-field(v-model.trim="editedRowModule.child.styles.module.height" label="Alto" hint="px, %" persistent-hint)
																template(v-if="editedRowModule.child.type == 'space'")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.container.background$color")
																template(v-if="editedRowModule.child.type == 'divider'")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.container.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno del contenedor
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$left")
																template(v-if="editedRowModule.child.type == 'social'")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.container.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno del contenedor
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$left")
																template(v-if="editedRowModule.child.type == 'footer'")
																	v-flex(xs12)
																		v-text-field(v-model.trim="editedRowModule.child.textHeader1" label="Texto 1")
																	v-flex(xs12)
																		v-text-field(v-model.trim="editedRowModule.child.textHeader2" label="Texto 2")
																	v-flex(xs12)
																		v-text-field(v-model.trim="editedRowModule.child.textFooter" label="Texto link")
																	v-flex(xs12)
																		v-text-field(v-model.trim="editedRowModule.child.linkFooter" label="Link url")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="editedRowModule.child.styles.container.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno del contenedor
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.child.styles.container.padding$left")
														template(v-if="editedRowModule.column.type == 'image'")
															v-flex(xs12)
																v-text-field(v-model.trim="editedRowModule.column.imageUri" label="Url Imagen")
															v-flex(xs6)
																v-text-field(v-model.trim="editedRowModule.column.styles.module.width" label="Ancho" hint="px, %" persistent-hint)
															v-flex(xs6)
																v-text-field(v-model.trim="editedRowModule.column.styles.module.height" label="Alto" hint="px, %" persistent-hint)
														template(v-if="editedRowModule.column.type == 'space'")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
														template(v-if="editedRowModule.column.type == 'divider'")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		br
																		span Relleno del contenedor
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$left")
														template(v-if="editedRowModule.column.type == 'social'")
															v-flex(xs12)
																v-text-field(label="Link Facebook" v-model.trim="editedRowModule.column.linkFacebook")
															v-flex(xs12)
																v-text-field(label="Link Twitter" v-model.trim="editedRowModule.column.linkTwitter")
															v-flex(xs12)
																v-text-field(label="Link Instagram" v-model.trim="editedRowModule.column.linkInstagram")
															v-flex(xs12)
																v-text-field(label="Link Google Plus" v-model.trim="editedRowModule.column.linkGoogle")
															v-flex(xs12)
																v-text-field(label="Link Pinterest" v-model.trim="editedRowModule.column.linkPinterest")
															v-flex(xs12)
																v-text-field(label="Link LinkedIn" v-model.trim="editedRowModule.column.linkLinkedIn")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		br
																		span Relleno del contenedor
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$left")
														template(v-if="editedRowModule.column.type == 'footer'")
															v-flex(xs12)
																v-text-field(v-model.trim="editedRowModule.column.textHeader1" label="Texto 1")
															v-flex(xs12)
																v-text-field(v-model.trim="editedRowModule.column.textHeader2" label="Texto 2")
															v-flex(xs12)
																v-text-field(v-model.trim="editedRowModule.column.textFooter" label="Texto link")
															v-flex(xs12)
																v-text-field(v-model.trim="editedRowModule.column.linkFooter" label="Link url")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs6)
																		span Color de Fondo
																	v-flex(xs6)
																		input(type="color" v-model="editedRowModule.column.styles.container.background$color")
															v-flex(xs12)
																v-layout(row wrap)
																	v-flex(xs4)
																		br
																		span Relleno del contenedor
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$top")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$right")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$bottom")
																	v-flex(xs2)
																		v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="editedRowModule.column.styles.container.padding$left")
											v-card-actions(v-if="editRowModule")
												v-spacer
												v-btn(text icon color="red" @click="deleteRowModule")
													v-icon fas fa-trash-alt
									v-expansion-panel
										v-expansion-panel-header
											div.body-2 Añadir Modulos
										v-expansion-panel-content
											v-card(flat)
												v-card-text
													v-container(grid-list-md fluid)
														v-layout(wrap)
															v-flex(xs4)
																drag.drag(:transfer-data="button") Boton
															v-flex(xs4)
																drag.drag(:transfer-data="column") Columna
															v-flex(xs4)
																drag.drag(:transfer-data="text") Texto
															v-flex(xs4)
																drag.drag(:transfer-data="image") Imagen
															v-flex(xs4)
																drag.drag(:transfer-data="space") Espacio
															v-flex(xs4)
																drag.drag(:transfer-data="divider") Divisor
															v-flex(xs4)
																drag.drag(:transfer-data="social") Social
															v-flex(xs4)
																drag.drag(:transfer-data="footer") Pie
									v-expansion-panel
										v-expansion-panel-header
											div.body-2 Estilos Globales
										v-expansion-panel-content
											v-card
												v-expansion-panels
													v-expansion-panel
														v-expansion-panel-header
															div.body-1 Cuerpo del Correo
														v-expansion-panel-content
															v-card(flat)
																v-card-text
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="template.styles.container.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Texto
																			v-flex(xs6)
																				input(type="color" v-model="template.styles.container.color")
																	v-flex(xs12)
																		v-select(:items="fonts" label="Font Family" v-model="template.styles.container.font$family")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Tamaño de letra
																			v-flex(xs6)
																				v-text-field(label="Font Size" value="14" type="number" hint="px" persistent-hint v-model.trim="template.styles.container.font$size")
													v-expansion-panel
														v-expansion-panel-header
															div.body-1 Contenedor de Contenido
														v-expansion-panel-content
															v-card(flat)
																v-card-text
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				br
																				span Ancho
																			v-flex(xs6)
																				v-text-field(label="Width" value="600" type="number" hint="px" persistent-hint v-model.trim="template.styles.module.width")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs6)
																				span Color de Fondo
																			v-flex(xs6)
																				input(type="color" v-model="template.styles.module.background$color")
																	v-flex(xs12)
																		v-layout(row wrap)
																			v-flex(xs4)
																				br
																				span Relleno
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="template.styles.module.padding$top")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="template.styles.module.padding$right")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="template.styles.module.padding$bottom")
																			v-flex(xs2)
																				v-text-field(label="" value="0" type="number" hint="px" persistent-hint v-model.trim="template.styles.module.padding$left")
									v-expansion-panel
										v-expansion-panel-header
											div.body-2 Avanzado
										v-expansion-panel-content
											v-card
												v-expansion-panels
													v-expansion-panel
														v-expansion-panel-header
															div.body-1 Exportar
														v-expansion-panel-content
															template(v-slot:header)
																span.body-1 Exportar
															v-card(flat)
																v-card-text
																	v-btn(@click="exportTemplate") Exportar
													v-expansion-panel
														v-expansion-panel-header
															div.body-1 Editar Cabecera HTML
														v-expansion-panel-content
															v-card(flat)
																v-card-text
																	v-btn(color="primary") Editar
		v-flex(xs12 sm6 md8 lg7)
			v-container(grid-list-xl)
				v-layout(row wrap)
					v-flex(xs12)
						a(ref="downloadTemplate" style="display:none")
						v-bottom-navigation(v-model="bottomNav" :value="true")
							v-btn(text value="edit")
								span Editar
								v-icon fas fa-edit
							v-btn(text value="preview")
								span Previsualizar
								v-icon fas fa-pager
					v-flex(xs12)
						div(style="overflow: auto; height: 300px;" :class="{ invisible: bottomNav == 'preview' }")
							div(:style="formatStyles(template.styles.container)")
								table(width="100%" :style="formatStyles(template.styles.module)" border="0" cellspacing="0" cellpadding="0" align="center" )
									Container(@drop="onDrop($event)" @drag-start="dragStart" @drag-end="(e) => dragEnd(e)" drag-class="card-ghost" drop-class="card-ghost-drop")
										Draggable(v-for="(row, index) in template.design" :key="index")
											table(style="width: 100%")
												tr.module(@click.prevent="editModule(row, null)" :style="row.type == 'column' ? formatStyles(row.styles.container) : ''")
													td(colspan="2" v-if="row.type == 'button'" :style="formatStyles(row.styles.container)")
														a(:href="row.buttonUri" target="_blank" :style="formatStyles(row.styles.module)") {{ row.buttonText }}
													template(v-if="row.type == 'column'")
														td.module(style="padding: 10px; width: 50%;")
															template(v-for="(child, idx) in row.childs")
																div(@click.prevent="editModule(row, child)")
																	div.mcolumn(v-if="child.type == 'button' && child.column == 1" :style="formatStyles(child.styles.container)")
																		a(:href="child.buttonUri" target="_blank" :style="formatStyles(child.styles.module)") {{ child.buttonText }}
																	div.mcolumn(v-if="child.type == 'image'  && child.column == 1" :style="formatStyles(child.styles.container)")
																		img(v-if="child.imageUri == ''" src="https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png" :style="formatStyles(child.styles.module)")
																		img(v-else :src="child.imageUri" :style="formatStyles(child.styles.module)")
																	div.mcolumn(v-if="child.type == 'text' && child.column == 1" :style="formatStyles(child.styles.container)")
																		p(v-if="child.text == ''" :style="formatStyles(child.styles.module)")
																			span Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
																		p(v-else :style="formatStyles(child.styles.module)" v-html="child.text")
																	div.mcolumn(v-if="child.type == 'space' && child.column == 1" :style="formatStyles(child.styles.container)")
																		p(:style="formatStyles(child.styles.module)")
																	div.mcolumn(v-if="child.type == 'divider' && child.column == 1" :style="formatStyles(child.styles.container)")
																		p(:style="formatStyles(child.styles.module)")
																	div.mcolumn(v-if="child.type == 'social' && child.column == 1" :style="formatStyles(child.styles.container)")
																		table(style="width: 100%")
																			tr
																				td
																					a(:href='child.linkFacebook' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.png' style="width: 50px")
																				td
																					a(:href='child.linkTwitter' target="_blank")
																						img(src='https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png' style="width: 50px")
																				td
																					a(:href='child.linkInstagram' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/instagram_circle_color-128.png' style="width: 50px")
																				td
																					a(:href='child.linkGoogle' target="_blank")
																						img(src='https://cdn1.iconfinder.com/data/icons/social-media-icon-1/112/google-plus-128.png' style="width: 50px")
																				td
																					a(:href='child.linkPinterest' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/capsocial-round/500/pinterest-256.png' style="width: 50px")
																				td
																					a(:href='child.linkLinkedIn' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/linkedin_circle_color-256.png' style="width: 50px")
																	div.mcolumn(v-if="child.type == 'footer' && child.column == 1" :style="formatStyles(child.styles.container)")
																		span {{ child.textHeader1 }}
																		br
																		span {{ child.textHeader2 }}
																		br
																		span
																			a(:href="child.linkFooter" target="_blank") {{ child.textFooter }}
															drop.drop(v-if="evalFirstColumn(row.childs)" @drop="(data, e) => { handleColumn(data, e, row, 1) }") Arrastrar elemento
															drop.drop(v-else @drop="(data, e) => { handleColumn(data, e, row, 1) }") Arrastrar elemento
														td.module(style="padding: 10px; width: 50%;")
															template(v-for="(child, idx) in row.childs")
																div(@click.prevent="editModule(row, child)")
																	div.mcolumn(v-if="child.type == 'button' && child.column == 2" :style="formatStyles(child.styles.container)")
																		a(:href="child.buttonUri" target="_blank" :style="formatStyles(child.styles.module)") {{ child.buttonText }}
																	div.mcolumn(v-if="child.type == 'image' && child.column == 2" :style="formatStyles(child.styles.container)")
																		img(v-if="child.imageUri == ''" src="https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png" :style="formatStyles(child.styles.module)")
																		img(:src="child.imageUri" :style="formatStyles(child.styles.module)")
																	div.mcolumn(v-if="child.type == 'text' && child.column == 2" :style="formatStyles(child.styles.container)")
																		p(v-if="child.text == ''" :style="formatStyles(child.styles.module)")
																			span Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
																		p(v-else :style="formatStyles(child.styles.module)" v-html="child.text")
																	div.mcolumn(v-if="child.type == 'space' && child.column == 2" :style="formatStyles(child.styles.container)")
																		p(:style="formatStyles(child.styles.module)")
																	div.mcolumn(v-if="child.type == 'divider' && child.column == 2" :style="formatStyles(child.styles.container)")
																		p(:style="formatStyles(child.styles.module)")
																	div.mcolumn(v-if="child.type == 'social' && child.column == 2" :style="formatStyles(child.styles.container)")
																		table(style="width: 100%")
																			tr
																				td
																					a(:href='child.linkFacebook' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.png' style="width: 50px")
																				td
																					a(:href='child.linkTwitter' target="_blank")
																						img(src='https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png' style="width: 50px")
																				td
																					a(:href='child.linkInstagram' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/instagram_circle_color-128.png' style="width: 50px")
																				td
																					a(:href='child.linkGoogle' target="_blank")
																						img(src='https://cdn1.iconfinder.com/data/icons/social-media-icon-1/112/google-plus-128.png' style="width: 50px")
																				td
																					a(:href='child.linkPinterest' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/capsocial-round/500/pinterest-256.png' style="width: 50px")
																				td
																					a(:href='child.linkLinkedIn' target="_blank")
																						img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/linkedin_circle_color-256.png' style="width: 50px")
																	div(v-if="child.type == 'footer' && child.column == 2" :style="formatStyles(child.styles.container)")
																		span {{ child.textHeader1 }}
																		br
																		span {{ child.textHeader2 }}
																		br
																		span
																			a(:href="child.linkFooter" target="_blank") {{ child.textFooter }}
															drop.drop(v-if="evalSecondColumn(row.childs)" @drop="(data, e) => { handleColumn(data, e, row, 2) }") Arrastrar elemento
															drop.drop(v-else @drop="(data, e) => { handleColumn(data, e, row, 2) }") Arrastrar elemento
													td(colspan="2" v-if="row.type == 'image'" :style="formatStyles(row.styles.container)")
														img(v-if="row.imageUri == ''" src="https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png" :style="formatStyles(row.styles.module)")
														img(v-else :src="row.imageUri" :style="formatStyles(row.styles.module)")
													td(colspan="2" v-if="row.type == 'text'" :style="formatStyles(row.styles.container)")
														p(v-if="row.text == ''" :style="formatStyles(row.styles.module)")
															span Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
														p(v-else :style="formatStyles(row.styles.module)" v-html="row.text")
													td(colspan="2" v-if="row.type == 'space'" :style="formatStyles(row.styles.container)")
														p(:style="formatStyles(row.styles.module)")
													td(colspan="2" v-if="row.type == 'divider'" :style="formatStyles(row.styles.container)")
														p(:style="formatStyles(row.styles.module)")
													td(colspan="2" v-if="row.type == 'social'" :style="formatStyles(row.styles.container)")
														table(style="width: 100%")
															tr
																td
																	a(:href='row.linkFacebook' target="_blank")
																		img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.png' style="width: 50px")
																td
																	a(:href='row.linkTwitter' target="_blank")
																		img(src='https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png' style="width: 50px")
																td
																	a(:href='row.linkInstagram' target="_blank")
																		img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/instagram_circle_color-128.png' style="width: 50px")
																td
																	a(:href='row.linkGoogle' target="_blank")
																		img(src='https://cdn1.iconfinder.com/data/icons/social-media-icon-1/112/google-plus-128.png' style="width: 50px")
																td
																	a(:href='row.linkPinterest' target="_blank")
																		img(src='https://cdn3.iconfinder.com/data/icons/capsocial-round/500/pinterest-256.png' style="width: 50px")
																td
																	a(:href='row.linkLinkedIn' target="_blank")
																		img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/linkedin_circle_color-256.png' style="width: 50px")
													td(colspan="2" v-if="row.type == 'footer'" :style="formatStyles(row.styles.container)")
														span {{ row.textHeader1 }}
														br
														span {{ row.textHeader2 }}
														br
														span
															a(:href="row.linkFooter" target="_blank") {{ row.textFooter }}
									tr.module
										td(colspan="2")
											drop.drop(@drop="handleDrop") Arrastrar el modulo aqui
						div#preview(style="overflow: auto; height: 300px;" ref="previewTemplate" :class="{ invisible: bottomNav == 'edit' }")
							div(:style="formatStyles(template.styles.container)")
								table(:style="formatStyles(template.styles.module)" border="0" cellspacing="0" cellpadding="0" align="center" )
									tr(v-for="(row, index) in template.design" :key="index" :style="row.type == 'column' ? formatStyles(row.styles.container) : ''")
										td(colspan="2" v-if="row.type == 'button'" :style="formatStyles(row.styles.container)")
											a(:href="row.buttonUri" target="_blank" :style="formatStyles(row.styles.module)") {{ row.buttonText }}
										template(v-if="row.type == 'column'")
											td(style="padding: 10px; width: 50%;")
												template(v-for="(child, idx) in row.childs")
													div
														div(v-if="child.type == 'button' && child.column == 1" :style="formatStyles(child.styles.container)")
															a(:href="child.buttonUri" target="_blank" :style="formatStyles(child.styles.module)") {{ child.buttonText }}
														div(v-if="child.type == 'image'  && child.column == 1" :style="formatStyles(child.styles.container)")
															img(v-if="child.imageUri == ''" src="https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png" :style="formatStyles(child.styles.module)")
															img(v-else :src="child.imageUri" :style="formatStyles(child.styles.module)")
														div(v-if="child.type == 'text' && child.column == 1" :style="formatStyles(child.styles.container)")
															p(v-if="child.text == ''" :style="formatStyles(child.styles.module)")
																span Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
															p(v-else :style="formatStyles(child.styles.module)" v-html="child.text")
														div(v-if="child.type == 'space' && child.column == 1" :style="formatStyles(child.styles.container)")
															p(:style="formatStyles(child.styles.module)")
														div(v-if="child.type == 'divider' && child.column == 1" :style="formatStyles(child.styles.container)")
															p(:style="formatStyles(child.styles.module)" style="height: 16px")
														div(v-if="child.type == 'social' && child.column == 1" :style="formatStyles(child.styles.container)")
															table(style="width: 100%")
																tr
																	td
																		a(:href='child.linkFacebook' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.png' style="width: 50px")
																	td
																		a(:href='child.linkTwitter' target="_blank")
																			img(src='https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png' style="width: 50px")
																	td
																		a(:href='child.linkInstagram' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/instagram_circle_color-128.png' style="width: 50px")
																	td
																		a(:href='child.linkGoogle' target="_blank")
																			img(src='https://cdn1.iconfinder.com/data/icons/social-media-icon-1/112/google-plus-128.png' style="width: 50px")
																	td
																		a(:href='child.linkPinterest' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/capsocial-round/500/pinterest-256.png' style="width: 50px")
																	td
																		a(:href='child.linkLinkedIn' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/linkedin_circle_color-256.png' style="width: 50px")
														div(v-if="child.type == 'footer' && child.column == 1" :style="formatStyles(child.styles.container)")
															span {{ child.textHeader1 }}
															br
															span {{ child.textHeader2 }}
															br
															span
																a(:href="child.linkFooter" target="_blank") {{ child.textFooter }}
											td(style="padding: 10px; width: 50%;")
												template(v-for="(child, idx) in row.childs")
													div
														div(v-if="child.type == 'button' && child.column == 2" :style="formatStyles(child.styles.container)")
															a(:href="child.buttonUri" target="_blank" :style="formatStyles(child.styles.module)") {{ child.buttonText }}
														div(v-if="child.type == 'image' && child.column == 2" :style="formatStyles(child.styles.container)")
															img(v-if="child.imageUri == ''" src="https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png" :style="formatStyles(child.styles.module)")
															img(v-else :src="child.imageUri" :style="formatStyles(child.styles.module)")
														div(v-if="child.type == 'text' && child.column == 2" :style="formatStyles(child.styles.container)")
															p(v-if="child.text == ''" :style="formatStyles(child.styles.module)")
																span Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
															p(v-else :style="formatStyles(child.styles.module)" v-html="child.text")
														div(v-if="child.type == 'space' && child.column == 2" :style="formatStyles(child.styles.container)")
															p(:style="formatStyles(child.styles.module)")
														div(v-if="child.type == 'divider' && child.column == 2" :style="formatStyles(child.styles.container)")
															p(:style="formatStyles(child.styles.module)" style="height: 16px")
														div(v-if="child.type == 'social' && child.column == 2" :style="formatStyles(child.styles.container)")
															table(style="width: 100%")
																tr
																	td
																		a(:href='child.linkFacebook' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.png' style="width: 50px")
																	td
																		a(:href='child.linkTwitter' target="_blank")
																			img(src='https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png' style="width: 50px")
																	td
																		a(:href='child.linkInstagram' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/instagram_circle_color-128.png' style="width: 50px")
																	td
																		a(:href='child.linkGoogle' target="_blank")
																			img(src='https://cdn1.iconfinder.com/data/icons/social-media-icon-1/112/google-plus-128.png' style="width: 50px")
																	td
																		a(:href='child.linkPinterest' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/capsocial-round/500/pinterest-256.png' style="width: 50px")
																	td
																		a(:href='child.linkLinkedIn' target="_blank")
																			img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/linkedin_circle_color-256.png' style="width: 50px")
														div.mcolumn(v-if="child.type == 'footer' && child.column == 2" :style="formatStyles(child.styles.container)")
															span {{ child.textHeader1 }}
															br
															span {{ child.textHeader2 }}
															br
															span
																a(:href="child.linkFooter" target="_blank") {{ child.textFooter }}
										td(colspan="2" v-if="row.type == 'image'" :style="formatStyles(row.styles.container)")
											img(v-if="row.imageUri == ''" src="https://res.cloudinary.com/hoiuqk13u/image/upload/v1551152441/default-image.png" :style="formatStyles(row.styles.module)")
											img(:src="row.imageUri" :style="formatStyles(row.styles.module)")
										td(colspan="2" v-if="row.type == 'text'" :style="formatStyles(row.styles.container)")
											p(v-if="row.text == ''" :style="formatStyles(row.styles.module)")
												span Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt elementum sem non luctus. Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
											p(:style="formatStyles(row.styles.module)" v-html="row.text")
										td(colspan="2" v-if="row.type == 'space'" :style="formatStyles(row.styles.container)")
											p(:style="formatStyles(row.styles.module)")
										td(colspan="2" v-if="row.type == 'divider'" :style="formatStyles(row.styles.container)")
											p(:style="formatStyles(row.styles.module)" style="height: 16px")
										td(colspan="2" v-if="row.type == 'social'" :style="formatStyles(row.styles.container)")
											table(style="width: 100%")
												tr
													td
														a(:href='row.linkFacebook' target="_blank")
															img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-512.png' style="width: 50px")
													td
														a(:href='row.linkTwitter' target="_blank")
															img(src='https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-256.png' style="width: 50px")
													td
														a(:href='row.linkInstagram' target="_blank")
															img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/instagram_circle_color-128.png' style="width: 50px")
													td
														a(:href='row.linkGoogle' target="_blank")
															img(src='https://cdn1.iconfinder.com/data/icons/social-media-icon-1/112/google-plus-128.png' style="width: 50px")
													td
														a(:href='row.linkPinterest' target="_blank")
															img(src='https://cdn3.iconfinder.com/data/icons/capsocial-round/500/pinterest-256.png' style="width: 50px")
													td
														a(:href='row.linkLinkedIn' target="_blank")
															img(src='https://cdn3.iconfinder.com/data/icons/free-social-icons/67/linkedin_circle_color-256.png' style="width: 50px")
										td(colspan="2" v-if="row.type == 'footer'" :style="formatStyles(row.styles.container)")
											span {{ row.textHeader1 }}
											br
											span {{ row.textHeader2 }}
											br
											span
												a(:href="row.linkFooter" target="_blank") {{ row.textFooter }}
		v-dialog(v-model="editor" scrollable persistent)
			v-card
				v-card-title.headline.grey.lighten-2(primary-title) Editar Texto
				v-card-text(style="height: 400px;")
					v-container(grid-list-md fluid)
						v-layout(wrap)
							v-flex(xs12 sm12 md4 lg4)
								v-layout(wrap)
									v-flex(xs12)
										v-chip.ma-2(label text-color="white") #[v-icon(left) fas fa-tag] Datos de Entidad - Avanzado
									v-flex(xs12)
										span.font-italic Nota(*): Puede seleccionar cualquiera de estas etiquetas de entidad y seran reemplazadas por el valor correspondiente, donde su plantilla sea utilizada. De no exisitir sera eliminada
									v-flex(xs12)
										v-expansion-panels(accordion)
											v-expansion-panel
												v-expansion-panel-header Usuarios
												v-expansion-panel-content
													v-layout(row)
														v-flex(xs4)
															span.drag-2(@click.passive="writeText('[NAME_USER]')") Nombre
														v-flex(xs4)
															span.drag-2(@click="writeText('[EMAIL_USER]')") Email
														v-flex(xs4)
															span.drag-2(@click="writeText('[PROFILE_USER]')") Perfil
							v-flex(xs12 sm12 md8 lg8)
								Editor(v-model="contentEditor" ref="editor" @update="updateText" @changeText="changeText" @changeSelection="changeSelection")
				v-divider
				v-card-actions
					v-spacer
					v-btn(color="primary" text @click="closeEditor") Cancelar
					v-btn(text @click="saveEditor") Guardar
</template>
<style>
.visible {
	display: inline-block;
}
.invisible {
	display: none;
}
.drop {
	display: inline-block;
	border-radius: 2px;
	color: '#000000' !important;
	background: #fbfbfc;
	position: relative;
	padding: 10px;
	text-align: center;
	vertical-align: top;
	border-style: dotted;
	border: 1px dashed #d4dadf;
	width: 100%;
}
.drag {
	display: inline-block;
	border-radius: 2px;
	background: #fbfbfc;
	position: relative;
	padding: 5px;
	text-align: center;
	vertical-align: center;
	border-style: dotted;
	border: 1px dashed #d4dadf;
	width: 100%;
	height: 100%;
}
.drag-2 {
	display: inline-block;
	border-radius: 2px;
	background: #fbfbfc;
	position: relative;
	padding: 5px;
	text-align: center;
	vertical-align: center;
	border-style: dotted;
	border: 1px dashed #d4dadf;
	width: 100%;
	height: 100%;
	cursor: pointer;
	transition: width 2s;
}
.drag-2:hover {
	-webkit-box-shadow: 0px 0px 10px 5px rgba(235, 226, 235, 1);
	-moz-box-shadow: 0px 0px 10px 5px rgba(235, 226, 235, 1);
	box-shadow: 0px 0px 10px 5px rgba(235, 226, 235, 1);
}
.module:hover {
	-webkit-box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	-moz-box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	cursor: pointer;
}
.mcolumn:hover {
	-webkit-box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	-moz-box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	cursor: pointer;
}
.card-ghost {
	transition: transform 0.18s ease;
	transform: rotateZ(0deg);
	-webkit-box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	-moz-box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	box-shadow: 0px 0px 15px 0px rgba(143, 132, 143, 1);
	background-color: #ffffff;
}

.card-ghost-drop {
	transition: transform 0.18s ease-in-out;
	transform: rotateZ(0deg);
}
</style>
<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import { Container, Draggable } from 'vue-smooth-dnd'
import Editor from '@/components/Editor'
import Util from '@/assets/js/util'
export default {
	components: {
		Container,
		Draggable,
		Editor
	},
	mixins: [validationMixin],
	model: {
		prop: 'templateDefault',
		event: 'change'
	},
	props: {
		generate: {
			type: Boolean,
			default: false
		},
		edited: {
			type: Number,
			default: -1
		},
		templateDefault: {
			type: Object,
			default() {
				return {
					name: '',
					subject: '',
					preheader: '',
					content: '',
					styles: {
						module: {
							background$color: '#FFFFFF',
							padding$top: '0px',
							padding$bottom: '0px',
							padding$left: '0px',
							padding$right: '0px',
							width: '600px',
							margin: '0 auto'
						},
						container: {
							background$color: '#FFFFFF',
							color: '#000000',
							font$family: 'Arial, Helvetica, sans-serif',
							font$size: '14px'
						}
					},
					design: [],
					inactive: false
				}
			}
		}
	},
	validations: {
		template: {
			name: {
				required,
				maxLength: maxLength(80),
				minLength: minLength(5)
			},
			inactive: { required }
		}
	},
	data() {
		return {
			dialog: false,
			writing: false,
			dTemplate: false,
			user: {},
			tabs: null,
			fonts: [
				{ text: 'Arial', value: 'Arial, Helvetica, sans-serif' },
				{
					text: 'Comic Sans MS',
					value: '"Comic Sans MS", cursive, sans-serif'
				},
				{
					text: 'Courier New',
					value: '"Courier New", Courier, monospace'
				},
				{ text: 'Georgia', value: 'Georgia, serif' },
				{ text: 'Helvetica', value: 'Arial, Helvetica, sans-serif' },
				{
					text: 'Lucida Sans Unicode',
					value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif'
				},
				{ text: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
				{
					text: 'Times New Roman',
					value: '"Times New Roman", Times, serif'
				},
				{
					text: 'Trebuchet MS',
					value: '"Trebuchet MS", Helvetica, sans-serif'
				},
				{ text: 'Verdana', value: 'Verdana, Geneva, sans-serif' }
			],
			weights: [
				{ text: 'normal', value: 'normal' },
				{ text: 'bold', value: 'bold' },
				{ text: '300', value: '300' },
				{ text: '400', value: '400' },
				{ text: '700', value: '700' }
			],
			button: {
				type: 'button',
				buttonText: 'Texto Boton',
				buttonUri: '',
				options: false,
				styles: {
					module: {
						background$color: 'rgb(51, 51, 51)',
						border$color: 'rgb(51, 51, 51)',
						border$style: 'solid',
						border$width: '1',
						border$radius: '6',
						color: 'rgb(255, 255, 255)',
						display: 'inline-block',
						font$family: 'Lucida Sans Unicode',
						font$size: '16',
						font$weight: 'normal',
						letter$spacing: '0',
						line$height: '16',
						padding$top: '12',
						padding$right: '18',
						padding$bottom: '12',
						padding$left: '18',
						text$align: 'center',
						text$decoration: 'none'
					},
					container: {
						text$align: 'center'
					}
				}
			},
			column: {
				type: 'column',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				},
				childs: []
			},
			text: {
				type: 'text',
				text: '',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				}
			},
			image: {
				type: 'image',
				imageUri: '',
				options: false,
				styles: {
					module: {
						width: '200'
					},
					container: {
						text$align: 'center'
					}
				}
			},
			space: {
				type: 'space',
				options: false,
				styles: {
					module: {
						padding$top: '0',
						padding$right: '0',
						padding$bottom: '30',
						padding$left: '0'
					},
					container: {
						text$align: 'center'
					}
				}
			},
			divider: {
				type: 'divider',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center',
						background$color: '#000000',
						height: '16'
					}
				}
			},
			social: {
				type: 'social',
				options: false,
				linkFacebook: '#',
				linkTwitter: '#',
				linkInstagram: '#',
				linkGoogle: '#',
				linkPinterest: '#',
				linkLinkedIn: '#',
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				}
			},
			footer: {
				type: 'footer',
				textHeader1: '[REMITENTE]',
				textHeader2: '[DIRECCION], [CIUDAD], [ESTADO] [CODIGO_POSTAL]',
				textFooter: 'Link',
				linkFooter: '#',
				options: false,
				styles: {
					module: {},
					container: {
						text$align: 'center'
					}
				}
			},
			pConfigTemplate: [0],
			pBuildTemplate: [],
			editRowModule: false,
			editedRowModule: null,
			editor: false,
			contentEditor: '',
			tempEditor: '',
			bottomNav: 'edit',
			itemPixels: [
				{ item: 'margin', default: 'auto', prefix: 'px' },
				{ item: 'margin$top', default: 'auto', prefix: 'px' },
				{ item: 'margin$bottom', default: 'auto', prefix: 'px' },
				{ item: 'margin$left', default: 'auto', prefix: 'px' },
				{ item: 'margin$right', default: 'auto', prefix: 'px' },
				{ item: 'padding', default: 'auto', prefix: 'px' },
				{ item: 'padding$top', default: 'auto', prefix: 'px' },
				{ item: 'padding$bottom', default: 'auto', prefix: 'px' },
				{ item: 'padding$left', default: 'auto', prefix: 'px' },
				{ item: 'padding$right', default: 'auto', prefix: 'px' },
				{ item: 'width', default: 'auto', prefix: 'px' },
				{ item: 'max$width', default: 'auto', prefix: 'px' },
				{ item: 'min$width', default: 'auto', prefix: 'px' },
				{ item: 'height', default: 'auto', prefix: 'px' },
				{ item: 'max$height', default: 'auto', prefix: 'px' },
				{ item: 'min$height', default: 'auto', prefix: 'px' },
				{ item: 'border$radius', default: 'auto', prefix: 'px' },
				{ item: 'border$width', default: 'auto', prefix: 'px' },
				{ item: 'letter$spacing', default: 'normal', prefix: 'px' },
				{ item: 'line$height', default: 'normal', prefix: 'px' }
			],
			positionEditor: {
				index: 0,
				length: 0
			},
			template: {
				name: '',
				subject: '',
				preheader: '',
				content: '',
				styles: {
					module: {
						background$color: '#FFFFFF',
						padding$top: '0px',
						padding$bottom: '0px',
						padding$left: '0px',
						padding$right: '0px',
						width: '600px',
						margin: '0 auto'
					},
					container: {
						background$color: '#FFFFFF',
						color: '#000000',
						font$family: 'Arial, Helvetica, sans-serif',
						font$size: '14px'
					}
				},
				design: []
			}
		}
	},
	watch: {
		edited(val) {
			this.template = this.methods.clonex(this.templateDefault)
		},
		generate(val) {
			if (val === true) {
				const content = this.$refs.previewTemplate.innerHTML.replace(
					'display: none; ',
					''
				)
				this.template.content = content
				this.$emit('change', this.template)
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.methods = new Util(this)
			this.template = this.methods.clonex(this.templateDefault)
			this.template.content = this.$refs.previewTemplate.innerHTML.replace(
				'display: none; ',
				''
			)
		},
		handleDrop(data, event) {
			const object = this.methods.clonex(data)
			if (object) {
				this.template.design.push(object)
			}
		},
		handleColumn(data, event, row, column) {
			if (data.type && data.type !== 'column') {
				const index = this.template.design.indexOf(row)
				const object = this.methods.clonex(data)
				object.column = column
				this.template.design[index].childs.push(object)
			}
		},
		formatStyles(styleObject) {
			let style = ''
			for (const prop in styleObject) {
				let value = styleObject[prop]
				this.itemPixels.forEach((element) => {
					if (element.item === prop) {
						value += value === '' ? element.default : element.prefix
					}
				})
				style += `${prop.replace('$', '-')}: ${value};`
			}
			return style
		},
		editModule(column, child) {
			this.editRowModule = true
			if (child !== null) {
				setTimeout(() => {
					this.editedRowModule = {
						column,
						child
					}
				}, 300)
			} else {
				this.editedRowModule = {
					column,
					child
				}
			}
			this.tabs = 'build'
			this.pBuildTemplate = [0]
		},
		evalFirstColumn(childs) {
			let val = true
			childs.forEach((element) => {
				if (element.column === 1) val = !val
			})
			return val
		},
		evalSecondColumn(childs) {
			let val = true
			childs.forEach((element) => {
				if (element.column === 2) val = !val
			})
			return val
		},
		deleteRowModule() {
			const idxColumn = this.template.design.indexOf(
				this.editedRowModule.column
			)
			if (this.editedRowModule.child == null) {
				this.template.design.splice(idxColumn, 1)
			} else {
				const object = this.template.design
				const idxChild = object[idxColumn].childs.indexOf(
					this.editedRowModule.child
				)
				object[idxColumn].childs.splice(idxChild, 1)
			}
			this.editRowModule = false
			this.editedRowModule = null
		},
		exportTemplate() {
			let temp = this.$refs.previewTemplate.innerHTML
			temp = temp.replace('display: none; ', '')
			const el = this.$refs.downloadTemplate
			el.download = `${this.template.name}.txt`
			el.href =
				'data:application/octet-stream,' + encodeURIComponent(temp)
			el.click()
		},
		onDrop(dropResult) {
			this.template.design = this.applyDrag(
				this.template.design,
				dropResult
			)
		},
		dragStart() {
			// this.updateContent()
		},
		log(...params) {
			// this.updateContent()
		},
		dragEnd(e) {
			// this.updateContent()
		},
		applyDrag(arr, dragResult) {
			const { removedIndex, addedIndex, payload } = dragResult
			if (removedIndex === null && addedIndex === null) return arr
			const result = [...arr]
			let itemToAdd = payload

			if (removedIndex !== null) {
				itemToAdd = result.splice(removedIndex, 1)[0]
			}

			if (addedIndex !== null) {
				result.splice(addedIndex, 0, itemToAdd)
			}
			return result
		},
		updateText(val) {
			this.tempEditor = val
		},
		setObjectEditor(object) {
			this.editor = true
			this.contentEditor = object
		},
		closeEditor() {
			this.editor = false
			this.contentEditor = ''
		},
		saveEditor() {
			this.editor = false
			this.contentEditor = ''
			if (this.editedRowModule !== null) {
				if (this.editedRowModule.child) {
					this.editedRowModule.child.text = this.tempEditor.html
				} else {
					this.editedRowModule.column.text = this.tempEditor.html
				}
			}
		},
		updateContent() {
			this.template.content = this.$refs.previewTemplate.innerHTML.replace(
				'display: none; ',
				''
			)
		},
		writeText(text) {
			const quill = this.$refs.editor.$children[0].quill
			this.writing = true
			quill.deleteText(
				this.positionEditor.index,
				this.positionEditor.length,
				'normal',
				true
			)
			quill.insertText(this.positionEditor.index, text, 'normal', true)
			this.writing = false
		},
		changeText(delta) {
			if (!this.writing) {
				const quill = this.$refs.editor.myQuillEditor
				this.positionEditor = {
					index: quill.getLength() - 1,
					length: 0
				}
			}
		},
		changeSelection(range) {
			// const quill = this.$refs.editor.myQuillEditor
			if (range.range) {
				this.positionEditor = range.range
			}
		}
	}
}
</script>
