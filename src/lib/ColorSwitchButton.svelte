<script lang="ts">
  let colorMode = 'light'
  function toggleColorMode(){
    colorMode = colorMode=== 'light' ? 'dark' : 'light' ;
    console.log(colorMode);
    document.getElementsByTagName('body')[0].setAttribute('data-theme', colorMode);
  }
</script>

{#if (colorMode === 'light')}
<button class="contrast" aria-label="Turn on dark mode" on:click={toggleColorMode}>
  Turn on dark mode
</button>
{:else}
<button class="contrast" aria-label="Turn off dark mode" on:click={toggleColorMode}>
  Turn off dark mode
</button>
{/if}