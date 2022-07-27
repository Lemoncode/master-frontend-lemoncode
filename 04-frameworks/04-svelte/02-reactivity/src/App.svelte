<script lang="ts">
  let name = 'Lemoncoders!';
  let list = ['melon', 'apple', 'banana'];
</script>

<main>
  <h1>Hello {name}</h1>
  <button
    on:click={() => {
      name = 'Master Frontend de Lemoncode';
    }}>
    Click me!
  </button>

  <div>
    {list.join(', ')}
  </div>

  <button
    on:click={() => {
      list[2] = 'kiwi';
    }}>
    Add item!
  </button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
