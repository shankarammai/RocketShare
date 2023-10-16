<script lang="ts">
	export let receivedFiles: Array<FileDetailsWithData> = [];
	export let showReceiveModal;
	export let receivingFileDetails: FileDetails = {};
	let dialog: HTMLDialogElement;
	let selectedFiles: Array<number> = [];

	console.log(receivedFiles);

	function closeModal() {
		dialog.close();
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

	function downloadSelected() {
		if (selectedFiles.length === 0) {
			alert("No files Selected");
			return;
		}
		selectedFiles.forEach((element) => {
			downloadBlob(receivedFiles[element].blob, receivedFiles[element].name);
		});
	}

	function resetFiles() {
		receivedFiles = [];
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
		{#if receivedFiles.length == 0 && Object.keys(receivingFileDetails).length == 0}
			<p>No Files Received</p>
		{/if}
		<div class="filesDiv">
			{#each receivedFiles as file, index}
				<div class="fileItem">
					<input
						type="checkbox"
						class="checkbox"
						bind:group={selectedFiles}
						value={index}
					/>
					{#if file.type.indexOf("image") > -1}
						<img
							class="receivedFile"
							src={URL.createObjectURL(file.blob)}
							alt="img"
							width="150px"
							height="84px"
						/>
					{:else}
						<div class="file-icon receivedFile">
							<p class="file-name">{file.name}</p>
						</div>
					{/if}
				</div>
			{/each}
			{#if Object.keys(receivingFileDetails).length !== 0}
				<div class="file-icon receivedFile" aria-busy="true">
					<p class="file-name">{receivingFileDetails.name ?? "file"}</p>
				</div>
			{/if}
		</div>
		<footer>
			<button class="bg-pink" on:click={resetFiles}>Reset</button>
			<button on:click={downloadSelected}>Download Selected</button>
			<button on:click={downloadFiles}>Download All</button>
			<button class="secondary" on:click={closeModal}> Cancel </button>
		</footer>
	</article>
</dialog>

<style>
	.file-icon {
		width: 150px;
		height: 100px;
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
	.receivedFile {
		margin-top: 5px;
		margin-left: 5px;
	}
	.filesDiv {
		display: flex;
		flex-wrap: wrap;
	}
	.fileItem {
		position: relative;
	}
	.checkbox {
		position: absolute;
		top: 10px;
		left: 7px;
		z-index: 1;
	}
	.bg-pink {
		background-color: #f42c6f;
		border-color: #f42c6f;
	}
	footer {
		display: flex;
		flex-wrap: wrap;
	}
	footer > * {
		margin-top: 5px;
	}
</style>
