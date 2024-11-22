import type { FunctionComponent, h } from "preact";
import { useState } from "preact/hooks";

interface GreetingProps {
  messages: string[];
}

const Greeting: FunctionComponent<GreetingProps> = ({ messages }) => {
  const randomMessage = (): string =>
    messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState<string>(messages[0]);

  return (
    <div>
      <h3>{greeting}! Thank you for visiting!</h3>
      <button onClick={() => setGreeting(randomMessage())}>New Greeting</button>
    </div>
  );
};

export default Greeting;
