import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface FooterProps {
  org: string;
}

export const Footer = component$<FooterProps>(({ org }) => {
  return (
    <div>
      <a
        preventdefault:click
        href={`https://github.com/${org}`}
        onClick$={() => {
          if (window.confirm("Do you really want to leave?")) {
            window.open(`https://github.com/${org}`);
          }
        }}
      >
        Go To {org}
      </a>
      <Link href={`/members/${org}`}>Organization members</Link>
    </div>
  );
});
