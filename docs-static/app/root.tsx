import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "@ts-retype/uikit/dist/index.css";
import appStyles from "@ts-retype/docs/dist/index.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "TS retype Docs",
  viewport: "width=device-width,initial-scale=1",
});

{/* <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inconsolata:wght@200;300;400;500;600;700;800;900&family=Mulish:wght@200;300;400;500;600;700;800;900&family=Source+Sans+Pro:wght@300;400;600;700&family=Ubuntu+Mono:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap" rel="stylesheet"> */}


export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: appStyles },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@200;300;400;500;600;700;800;900&family=Exo+2:wght@200;300;400;500;600;700;800;900&display=swap" },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
