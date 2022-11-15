<template lang="pug">
	v-container
		AccountFinance
</template>
<script>
import AccountFinance from '@/components/account/finance/Page'
export default {
	layout: 'dashboard',
	name: 'Me',
	components: {
		AccountFinance
	}
}
</script>
