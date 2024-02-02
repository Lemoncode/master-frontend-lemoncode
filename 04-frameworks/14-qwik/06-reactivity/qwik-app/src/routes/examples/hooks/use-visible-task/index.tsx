import { component$ } from "@builder.io/qwik";
import { Clock } from "~/components/clock";

export default component$(() => {
  return (
    <main style={{ backgroundColor: "black", color: 'white' }}>
      <p>
        This is an example of Lazy executing code on component when component
        becomes visible.
      </p>

      <p style={{ height: "800px" }}>
        ⬇️ <strong>Scroll down</strong> until the clock is in view.
      </p>

      <Clock />
    </main>
  );
});
