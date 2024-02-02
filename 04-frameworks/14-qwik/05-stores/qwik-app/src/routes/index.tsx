import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Title } from "../components/title.component";
import { Footer } from '../components/footer.component';

export default component$(() => {
  const displayTitle = useSignal(false);
  const onClick = $(() => {
    displayTitle.value = !displayTitle.value;
  });
  return (
    <>
      <Title display={displayTitle.value} />
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </p>
      <button
        onClick$={onClick}
      >
        Toggle Title
      </button>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  // title: "Welcome to Qwik",
  title: "Welcome to My Awesome App",
  meta: [
    {
      name: "description",
      // content: "Qwik site description",
      content: "Awesome App",
    },
  ],
};

// interface TitleProps {
//   display: boolean;
// }

// const Title = component$<TitleProps>(({ display }) => {
//   if (display) {
//     return <h1>Hi 🍋's this app it's going to be awesome</h1>;
//   }
//   return <></>;
// });
