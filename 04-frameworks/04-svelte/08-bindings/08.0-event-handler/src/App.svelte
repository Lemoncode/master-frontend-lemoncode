<script lang="ts">
  let name: string = 'Lemoncoders';
  let a: number = 0,
    b: number = 0;

  const handleInput = e => {
    name = e.target.value;
  };

  const handleChangeA = e => {
    a = e.target.value;
  };

  const handleChangeB = e => {
    b = e.target.value;
  };
</script>

<main>
  <h1>Hello {name}!</h1>
  <input value={name} on:input={handleInput} />

  <div>
    <input type="number" value={a} on:input={handleChangeA} min="0" max="10" />
    <input type="range" value={a} on:input={handleChangeA} min="0" max="10" />
  </div>

  <div>
    <input type="number" value={b} on:input={handleChangeB} min="0" max="10" />
    <input type="range" value={b} on:input={handleChangeB} min="0" max="10" />
  </div>

  <p>Resultado: {a} + {b} = {a + b}</p>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
