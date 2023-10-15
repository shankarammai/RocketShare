<script lang="ts">
	import { getContext } from "svelte";
	export let show = false;
	export let isSending = false;
	const { sendData }: { sendData: (files: any) => void } =
		getContext("peerFunctions");
	let dialog: HTMLDialogElement;
	let files: FileList;

	function closeModal() {
		dialog.close();
		show = false;
	}
</script>

<dialog bind:this={dialog} open>
	<article>
		<h2>Choose files to send.</h2>
		<hr />
		<input type="file" bind:files multiple />
		<footer>
			<button class="secondary" on:click={closeModal}> Cancel </button>
			<button
				on:click={() => {
					sendData(files);
				}}>Send Files</button
			>
			{#if isSending}
				<button aria-busy="true" aria-label="Sending..." />
			{/if}
		</footer>
	</article>
</dialog>

<style>
</style>
