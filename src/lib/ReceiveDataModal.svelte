<script lang="ts">
	export let receivedFiles: Array<FileDetailsWithData> = [];
	export let showReceiveModal;
	export let receivingFileDetails: FileDetails = {};
	let dialog: HTMLDialogElement;

	function closeModal() {
		dialog.close();
		receivedFiles = [];
		showReceiveModal = false;
	}
	function downloadFiles() {
		if (receivedFiles.length === 0) {
			alert("Files Not received");
			return;
		}

		receivedFiles.forEach((file) => {
			downloadBlob(file.blob, file.name);
		});
	}

	function downloadBlob(blob: Blob, fileName: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.style.display = "none";
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}
</script>

<dialog bind:this={dialog} open>
	<article>
		<h2>Received files</h2>
		{#each receivedFiles as file}
			{#if file.type.indexOf("image") > -1}
				<img
					src={URL.createObjectURL(file.blob)}
					alt="img"
					width="100px"
					height="100px"
				/>
			{:else}
				<div class="file-icon">
					<p class="file-name">{file.name}</p>
				</div>
			{/if}
		{/each}
		{#if Object.keys(receivingFileDetails).length !== 0}
			<div class="file-icon" aria-busy="true">
				<p class="file-name">{receivingFileDetails.name ?? "file"}</p>
			</div>
		{/if}

		<footer>
			<button class="secondary" on:click={closeModal}> Cancel </button>
			<button on:click={downloadFiles}>Download All</button>
		</footer>
	</article>
</dialog>

<style>
	.file-icon {
		width: 150px;
		height: 120px;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-top-right-radius: 10px; /* Curved top-right corner */
		padding: 10px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.file-name {
		font-size: 14px;
	}
</style>
