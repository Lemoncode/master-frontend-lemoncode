<script lang="ts">
  let name: string = 'Lemoncoders';
  let a: number = 0,
    b: number = 0;
</script>

<main>
  <h1>Hello {name}!</h1>
  <input bind:value={name} />

  <div>
    <input type="number" bind:value={a} min="0" max="10" />
    <input type="range" bind:value={a} min="0" max="10" />
  </div>

  <div>
    <input type="number" bind:value={b} min="0" max="10" />
    <input type="range" bind:value={b} min="0" max="10" />
  </div>

  <p>Resultado: {a} + {b} = {a + b}</p>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
