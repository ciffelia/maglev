import { useState } from "react";

import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import reactLogo from "./assets/react.svg";

import viteLogo from "/vite.svg";

import "./app.css";

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>
        <a href="https://react.dev" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
        <a href="https://workers.cloudflare.com/" target="_blank">
          <img
            alt="Cloudflare logo"
            className="logo cloudflare"
            src={cloudflareLogo}
          />
        </a>
      </div>
      <h1>Vite + React + Cloudflare</h1>
      <div className="card">
        <button
          aria-label="increment"
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          aria-label="get name"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            fetch("/api/ping")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => {
                setName(data.name);
              });
          }}
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>api/index.ts</code> to change the name
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
