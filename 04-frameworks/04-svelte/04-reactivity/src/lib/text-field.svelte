<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		value: string;
		onchangetext?: (value: string) => void;
	}

	let { id, name, value = $bindable(), onchangetext }: Props = $props();

	const oninput: FormEventHandler<HTMLInputElement> = (e) => {
		const target = e.target as HTMLInputElement;
		value = target.value;
		onchangetext?.(target.value);
	};
</script>

<input type="text" {id} {name} {value} {oninput} />

<style>
	input {
		padding: 0.5rem;
		font-size: 1rem;
		border: 2px solid #0099ff;
	}

	input:focus {
		outline: none;
		border-color: #ff9900;
	}
</style>
