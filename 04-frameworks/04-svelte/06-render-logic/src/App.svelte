<script lang="typescript">
  let user = { loggedIn: false };

  const toggle = () => {
    user.loggedIn = !user.loggedIn;
  };

  let films = [
    { id: 'J9fc6bW_oH0', name: 'Cube' },
    { id: 'OTPtu78Dnpg', name: 'Hypercube' },
    { id: 'Jb1I2qVau60', name: 'Cube Zero' },
  ];
</script>

{#if user.loggedIn}
  <p>You are logged in</p>
  <button on:click={toggle}>Logout</button>

  <h1>The Complete Cube Trilogy</h1>

  <ul>
    {#each films as film (film.id)}
      <li>
        <a target="_blank" href="https://www.youtube.com/watch?v={film.id}">
          {film.name}
        </a>
      </li>
    {/each}
  </ul>
{:else}
  <button on:click={toggle}>Login</button>
{/if}
