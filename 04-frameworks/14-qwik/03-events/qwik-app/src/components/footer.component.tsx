import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  return (
    <div>
      <a
        preventdefault:click
        href="https://github.com/lemoncode"
        onClick$={() => {
          if (window.confirm("Do you really want to leave?")) {
            window.open("https://github.com/lemoncode", "Thanks for Visiting!");
          }
        }}
      >
        Go To Lemonland
      </a>
    </div>
  );
});
