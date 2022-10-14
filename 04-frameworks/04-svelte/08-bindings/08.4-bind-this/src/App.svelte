<script lang="ts">
  import { onMount } from 'svelte';
  import svg from './assets/lemon.svg';

  let logo: HTMLImageElement;

  onMount(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      logo.style.transform = `rotate(${i}deg)`;
    }, 50);

    return () => clearInterval(interval);
  });
</script>

<main>
  <h1>Hello Svelte!</h1>
  <img bind:this={logo} alt="" src={svg} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }

  :global(body) {
    text-align: center;
  }

  img {
    width: 50%;
  }
</style>
