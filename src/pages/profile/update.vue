<script setup="ts">
	import { useHead } from '@vueuse/head'
	import { useViewWrapper } from '/@src/stores/viewWrapper'

	const viewWrapper = useViewWrapper()
	viewWrapper.setPageTitle('Profile Update')

	useHead({
	  title: 'Profile Update - LexAlgeria',
	})
</script>

<template>
	<UpdateProfile />
</template>