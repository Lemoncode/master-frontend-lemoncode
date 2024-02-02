import {
  component$,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./clock.css?inline";

interface ClockStore {
  hour: number;
  minute: number;
  second: number;
}

function updateClock(store: ClockStore) {
  const now = new Date();
  store.second = now.getSeconds();
  store.minute = now.getMinutes();
  store.hour = now.getHours();
}

function formatTime(value: number): string {
  return value < 10 ? `0${value}` : value.toString();
}

export const Clock = component$(() => {
  useStyles$(styles);
  const store = useStore<ClockStore>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  useVisibleTask$(({ cleanup }) => {
    const id = setInterval(() => {
      updateClock(store);
    }, 1000);

    cleanup(() => clearInterval(id));
  });
  return (
    <div class="clock">
      {`${formatTime(store.hour)}:${formatTime(store.minute)}:${formatTime(store.second)}`}
    </div>
  );
});
