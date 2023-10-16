<script lang="ts">
	export let userName = "";
	export let peerId = "";
	export let userAgent = "Unknown";
	export let self = false;
	export let showSendModal = false;
	export let showReceiveModal = false;
	export let friendPeerId = "";

	function handleClickedUser() {
		if (self) {
			showReceiveModal = !showReceiveModal;
		} else {
			showSendModal = !showSendModal;
			friendPeerId = peerId;
		}
	}
</script>

<div
	class={self ? "centerText myself" : "centerText"}
	on:click={handleClickedUser}
>
	<img src={"https://robohash.org/" + userName + "?size=150x150&set=set4"} />
	<hgroup>
		<p><strong>{userName}</strong></p>
		<p>{userAgent}</p>
		{#if self}
			<p class="youAreVisibleText">
				You are visible by this name in the network
			</p>
		{/if}
	</hgroup>
</div>

<style>
	.centerText {
		text-align: center;
	}
	.myself {
		position: fixed;
		top: 80%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.youAreVisibleText {
		color: blueviolet;
	}
</style>
