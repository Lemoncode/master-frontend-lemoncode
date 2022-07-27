<script lang="typescript">
  let m = { x: 0, y: 0 };

  const handleMouseMove = event => {
    m.x = event.clientX;
    m.y = event.clientY;
  };
</script>

<div on:mousemove={handleMouseMove}>The mouse position is {m.x} x {m.y}</div>

<style>
  div {
    width: 98vw;
    height: 98vh;
    margin: auto;
    border: 1px solid red;
  }
</style>
