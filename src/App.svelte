<script>
	import { onMount, tick } from 'svelte'
	import { fade } from 'svelte/transition';
	import { shuffle } from './lib/shuffle'

	let showNav = false
	let tracks = []
	let channel = 0
	let times = {}
	let loaded = false
	let title = ''
	let subtitle = ''

	onMount(() => {
		fetch('files.json')
			.then(resp => resp.json())
			.then(data => {
				tracks = shuffle(data)
				loaded = true
				tick().then(() => {
					let video = document.getElementById('video')
				  video.src = tracks[0]
					setText()
				  video.play()
				})
			})
	})

	function handleMousemove() {
		showNav = true
		setTimeout(() => { showNav = false }, 5000)
	}

	function handleKeydown({code}) {
		if (code === 'ArrowRight') videoStep(1)
		if (code === 'ArrowLeft') videoStep(-1)
	}

	function setText() {
		const [Tracktitle, TrackSubtitle = ''] = tracks[channel].replace('.mp4', '').split(' - ')
		title = Tracktitle
		subtitle = TrackSubtitle
	}

	const videoStep = (step) => {
		let video = document.getElementById('video')
		times = {...times, [channel]: video.currentTime }
		channel = channel === tracks.length - 1 ? 0 : channel + step
    video.src = tracks[channel]
		setText()
		if (times[channel]) video.currentTime = times[channel]
		video.play()
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<main on:mousemove={handleMousemove}>
	{#if loaded}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video width="920" id='video' autoplay="autoplay" loop="loop">
			<source src="" type="video/mp4">
		</video>
	{#if showNav}
		<div class='buttons' transition:fade>
			<button on:click={() => videoStep(-1)} class='left button'>&larr;</button>
			<button on:click={() => videoStep(1)} class='right button'>&rarr;</button>
		</div>
	{/if}
	<div class="content">
		<div class='container'>
			<h1 class='title'>{title}</h1>
			<p class='subtitle'>{subtitle}</p>
		</div>
  </div>
	{/if}
</main>

<style>
	.title {
		margin: 0;
		font-size: 2.4rem;
	}
	.subtitle {
		padding: 0;
		margin: 0;
		font-size: 1.6rem;
		font-weight: 300;
	}
	#video {
		position: fixed;
		right: 0;
		bottom: 0;
		min-width: 100%;
		min-height: 100%;
	}
	.content {
		position: fixed;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		color: #f1f1f1;
		width: 100%;
  }
	.left {
		float: left;
	}
	.right {
		float: right;
	}
	.button {
		width: 15rem;
		height: 60%;
		background: #00000080;
		color: #f5f5f5de;
		font-size: 3rem;
		font-weight: 800;
		padding: 10px;
		border: 1px solid #5c5c5c5e;
		margin: 20px 0;
	}
	.container {
		padding: 10px 20px;
	}
	.buttons {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
	}
</style>