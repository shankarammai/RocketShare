<script lang="ts">
	import { onMount, onDestroy, setContext } from "svelte";
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
	import ReceiveDataModal from "./lib/ReceiveDataModal.svelte";

	let myNanoId = nanoid(10);
	let myPublicIP = "";
	let myPeer: Peer = new Peer(myNanoId);
	let myName = generateRandomName();
	let myDocRefId = "";
	let otherInNetwork: Record<string, StoredDataItem> = {};
	let myBrowser = getBrowserName();
	let showSendModal: boolean = false;
	let showReceiveModal: boolean = false;
	let friendPeerId: string = "";
	let receivedFiles: Array<FileDetailsWithData> = [];
	let currentReceivingFile: Array<any> = [];
	let currentReceivingFileDetails: FileDetails = {};
	let isSending: boolean = false;

	setContext("peerFunctions", { sendData });

	//send
	function sendData(files: FileList) {
		isSending = true;
		let conn = myPeer.connect(friendPeerId);
		conn.on("open", function () {
			console.log("connection open");
			// Receive messages
			conn.on("data", function (data) {
				showReceiveModal = true;
				console.log("Received", data);
			});
			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`);
				file.arrayBuffer().then((buffer) => {
					const sendInitialData = {
						type: file.type,
						name: file.name,
						Totalsize: file.size,
						sendType: "sendStart",
					};
					conn.send(sendInitialData);
					const chunkSize = 16 * 1024;
					// Keep chunking, and sending the chunks to the other peer
					while (buffer.byteLength) {
						const chunk = buffer.slice(0, chunkSize);
						buffer = buffer.slice(chunkSize, buffer.byteLength);
						// Send the chunk!
						conn.send(chunk);
					}
					// Send end message
					conn.send({ sendType: "sendDone" });
				});
			}
		});
		isSending = false;
	}

	//receive
	myPeer.on("connection", function (conn) {
		conn.on("data", (data: any) => {
			if (data instanceof Uint8Array) {
				currentReceivingFile.push(data);
			} else {
				if (data.sendType === "sendDone") {
					let myFile = new Blob(currentReceivingFile, {
						type: currentReceivingFileDetails.type,
					});
					let fileAndDetails: FileDetailsWithData = {
						name: currentReceivingFileDetails.name ?? "Unknown",
						type: currentReceivingFileDetails.type ?? "type",
						blob: myFile,
					};
					console.log(fileAndDetails);
					let newReceivedFiles = [...receivedFiles, ...[fileAndDetails]];
					receivedFiles = newReceivedFiles;
					currentReceivingFile = [];
					currentReceivingFileDetails = {};
				}
				if (data.sendType === "sendStart") {
					showReceiveModal = true;
					currentReceivingFileDetails = data;
				}
			}
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
				snapshot.docChanges().forEach((change) => {
					const docId = change.doc.id;
					const docData = change.doc.data();
					if (change.type === "added") {
						otherInNetwork[docId] = docData as StoredDataItem;
						otherInNetwork = otherInNetwork;
					}
					if (change.type === "modified") {
						otherInNetwork[docId] = docData as StoredDataItem;
						otherInNetwork = otherInNetwork;
					}
					if (change.type === "removed") {
						let newOtherInNetwork = { ...otherInNetwork };
						delete newOtherInNetwork[docId];
						otherInNetwork = newOtherInNetwork;
					}
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
						bind:friendPeerId
						bind:showSendModal
						userName={data["name"]}
						userAgent={data["agent"]}
						peerId={data["id"]}
					/>
				{/if}
			{/each}
		{/if}
	</div>
	<div>
		<User
			self={true}
			userName={myName}
			userAgent={myBrowser}
			bind:showReceiveModal
		/>
	</div>
	{#if showSendModal}
		<SendDataModal bind:show={showSendModal} bind:isSending />
	{/if}

	{#if showReceiveModal}
		<ReceiveDataModal
			bind:showReceiveModal
			bind:receivedFiles
			bind:receivingFileDetails={currentReceivingFileDetails}
		/>
	{/if}
</main>

<style>
	:global(html[data-theme="light"] > *),
	:global([data-theme="light"]) {
		--pico-background-color: aliceblue;
		--pico-color: #1d3040;
	}
	:global(html[data-theme="dark"] > *),
	:global([data-theme="light"]) {
		--pico-background-color: #1d3040;
		--pico-color: #bfc2c7;
	}
	main {
		margin-left: 2rem;
		margin-right: 2rem;
	}
	#connectText {
		text-align: center;
		color: cadetblue;
	}
</style>
