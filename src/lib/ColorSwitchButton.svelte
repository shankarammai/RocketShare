<script lang="ts">
	let colorMode = "dark";
	function toggleColorMode() {
		colorMode = colorMode === "light" ? "dark" : "light";
		console.log(colorMode);
		document
			.getElementsByTagName("html")[0]
			.setAttribute("data-theme", colorMode);
	}
</script>

{#if colorMode === "light"}
	<button aria-label="Turn on dark mode" on:click={toggleColorMode}>
		<i class="bi bi-brightness-high" />
	</button>
{:else}
	<button aria-label="Turn off dark mode" on:click={toggleColorMode}>
		<i class="bi bi-moon-stars-fill" />
	</button>
{/if}
