<script lang="ts">
	export let receivedFiles: Array<any> = [];
	export let showReceiveModal;
	let dialog: HTMLDialogElement;

	function closeModal() {
		dialog.close();
		receivedFiles = [];
		showReceiveModal = false;
	}
	function downloadFiles() {
    receivedFiles.forEach(file => {
      downloadBlob(file, 'img.jpg');
    });
    
  }

  function downloadBlob(blob:any, fileName:string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
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
			<img src={URL.createObjectURL(file)} alt="img"/>
		{/each}
		<footer>
			<button class="secondary" on:click={closeModal}> Cancel </button>
			<button on:click={downloadFiles}>Download All</button>
		</footer>
	</article>
</dialog>

<style>
</style>
