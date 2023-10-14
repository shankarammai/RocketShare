<script lang="ts">
	import ColorSwitchButton from "./ColorSwitchButton.svelte";
    import Logo from '../assets/logo.png';
</script>

<nav>
	<ul>
		<li>
			<img src={Logo} alt="RocketShare" />
		</li>
	</ul>
	<ul>
		<li>
			<ColorSwitchButton />
		</li>
		<li><a href="https://shankarammai.github.io/RocketShare" class="secondary"><i class="bi bi-github"></i></a></li>
	</ul>
</nav>
<style>
    img{
        width: 6rem;
        height: 5rem;
    }
</style>
