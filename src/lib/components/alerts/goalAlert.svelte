<script>
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import PopcornIcon from '@lucide/svelte/icons/popcorn';
</script>

<Alert.Root variant="destructive">
	<AlertCircleIcon />
	<Alert.Title>Enter a valid goal time from 1min to 86400mins</Alert.Title>
</Alert.Root>
