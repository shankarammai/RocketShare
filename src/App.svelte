<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import NavBar from "./lib/NavBar.svelte";
	import { database } from "./Firebase";
	import User from "./lib/User.svelte";
	import {
		onSnapshot,
		doc,
		collection,
		addDoc,
		deleteDoc,
	} from "firebase/firestore";
	import { Peer } from "peerjs";
	import { nanoid } from "nanoid";
	import { generateRandomName } from "./Names";
	import { getBrowserName } from "./BrowserAgent";
	import SendDataModal from "./lib/SendDataModal.svelte";

	let myNanoId = nanoid(8);
	let myPublicIP = "";
	let myPeer: Peer = new Peer(myNanoId);
	let myName = generateRandomName();
	let myDocRefId = "";
	let otherInNetwork: Record<string, StoredDataItem> = {};
	let myBrowser = getBrowserName();
	let showSendModal: boolean = false;

	//send
	function sendData(peerId: string) {
		let conn = myPeer.connect(peerId);
		conn.on("open", function () {
			// Receive messages
			conn.on("data", function (data) {
				console.log("Received", data);
			});

			// Send messages
			conn.send("Hello!");
		});
	}

	//receive
	myPeer.on("connection", function (conn) {
		conn.on("data", (data) => {
			console.log("data received");
		});
	});

	//Get the IP, Put it in database , listen to new devices in network
	onMount(async () => {
		//Getting Public IP for me
		const response = await fetch(import.meta.env.VITE_GET_IP_HOST);
		const data = await response.json();
		myPublicIP = data.ip;

		window.addEventListener("beforeunload", handleBeforeUnLoad);

		if (myPublicIP != "") {
			addData({ id: myNanoId, name: myName, agent: myBrowser });
			const collectionRef = collection(database, myPublicIP);
			const unsuscribe = onSnapshot(collectionRef, (snapshot) => {
				// otherInNetwork= snapshot.docs.map((doc)=>doc.data());
				snapshot.docChanges().forEach((change) => {
					const docId = change.doc.id;
					const docData = change.doc.data();
					if (change.type === "added") {
						// Document added
						console.log("New document:", change.doc.data());
						otherInNetwork[docId] = docData as StoredDataItem;
						otherInNetwork = otherInNetwork;
					}
					if (change.type === "modified") {
						// Document modified
						console.log("Modified document:", change.doc.data());
						otherInNetwork[docId] = docData as StoredDataItem;
						otherInNetwork = otherInNetwork;
					}
					if (change.type === "removed") {
						// Document removed
						console.log("Removed document:", change.doc.data());
						let newOtherInNetwork = { ...otherInNetwork };
						delete newOtherInNetwork[docId];
						otherInNetwork = newOtherInNetwork;
					}
					console.log(otherInNetwork);
				});
			});
		}
	});

	onDestroy(() => {
		// Remove the beforeunload event handler when the component is destroyed
		window.removeEventListener("beforeunload", handleBeforeUnLoad);
	});

	function handleBeforeUnLoad() {
		deleteDoc(doc(database, myPublicIP, myDocRefId));
	}

	async function addData(dataToAdd: object) {
		const documentRef = collection(database, myPublicIP);
		try {
			const docRef = await addDoc(documentRef, dataToAdd);
			myDocRefId = docRef.id;
			console.log("Document written with ID: ", docRef.id);
		} catch (error) {
			console.error("Error adding document: ", error);
		}
	}
</script>

<main>
	<NavBar />
	<div class="grid">
		{#if Object.keys(otherInNetwork).length < 2}
			<p class="primary" id="connectText">
				<strong>Please Open RocketShare on other devices to share files.</strong
				>
			</p>
		{:else}
			{#each Object.entries(otherInNetwork) as [title, data]}
				{#if title != myDocRefId}
					<User
						bind:showSendModal
						userName={data["name"]}
						userAgent={data["agent"]}
						peerId={data["id"]}
					/>
				{/if}
			{/each}
		{/if}
	</div>
	<User self={true} userName={myName} userAgent={myBrowser} />
	{#if showSendModal}
		<SendDataModal bind:show={showSendModal} />
	{/if}
</main>

<style>
	main {
		margin-left: 2rem;
		margin-right: 2rem;
	}
	#connectText {
		text-align: center;
		color: cadetblue;
	}
</style>
