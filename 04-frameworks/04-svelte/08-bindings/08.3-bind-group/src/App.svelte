<script lang="ts">
  let phone = '';
  let training = [];

  $: console.log(phone, training);
</script>

<main>
  <h1>Hello Svelte!</h1>

  <div>
    <p>Select your mobile phone:</p>
    <input type="radio" bind:group={phone} value="iphone" /> iPhone
    <input type="radio" bind:group={phone} value="samsung" /> Samsung
    <input type="radio" bind:group={phone} value="xiaomi" /> Xiaomi
  </div>

  <div>
    <p>Select multiple:</p>
    <input type="checkbox" bind:group={training} value="master-frontend" /> Master Frontend
    <input type="checkbox" bind:group={training} value="bootcamp-backend" /> Bootcamp Backend
    <input type="checkbox" bind:group={training} value="bootcamp-devops" /> Bootcamp DevOps
  </div>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
