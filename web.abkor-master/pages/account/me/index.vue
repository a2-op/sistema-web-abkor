<template lang="pug">
	v-container
		AccountMe
</template>
<script>
import AccountMe from '@/components/account/me/Page'
export default {
	layout: 'dashboard',
	name: 'Me',
	components: {
		AccountMe
	}
}
</script>
