<script lang="ts">
    export let show = false;
    let dialog: HTMLDialogElement;

    function closeModal(){
        dialog.close();
        show=false;
    }
    function downloadFiles(){
        
    }

</script>


<dialog bind:this={dialog} open>
    <article>
      <h2>Received files</h2>
      <hr>
      <input type="file" multiple/>
      <footer>
        <button class="secondary" on:click={closeModal}>
          Cancel
        </button>
        <button on:click={downloadFiles}>Download All</button>
      </footer>
    </article>
  </dialog>

  <style>

  </style>