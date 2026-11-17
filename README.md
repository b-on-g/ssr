# $bog_ssr

Server-side rendering of `$mol_view` on request, with client-side adoption of the server DOM. A prototype for the [e18e framework-performance](https://github.com/e18e/framework-performance) routes.

## How it works

- **Server.** `$bog_ssr_server` is a `$mol_rest_resource` served by `$mol_rest_server`. On each request it renders `$bog_ssr` into a jsdom `body` (`$mol_dom_context` in node) and replies with `outerHTML`. Nothing is cached.
- **Same ids on both sides.** The server instance is named `$bog_ssr.Root(0)`, the same name the browser autobind gives the root view, so every element id in the server HTML equals the `dom_id()` of the view that owns it in the browser.
- **Adoption.** `hydrate.web.ts` makes `dom_node_external` pick the existing element by id before creating a new one. `$mol_dom_render_children` then finds every node already in place and touches nothing: zero nodes are removed or added after load.
- **State.** Server-rendered rows go to `<script type="application/json" id="bog_ssr_rows">`, the browser reads them instead of fetching.
- **Routing.** `$bog_ssr_route` reads `location.pathname` and uses `history.pushState`; links call it on click.

## Routes

| Path | Rendering |
| --- | --- |
| `/server-side-rendered` | 1000 rows on the server, adopted in the browser |
| `/server-side-rendered/:id` | `<p id="detail-id">` on the server |
| `/client-side-rendered` | empty body, 1000 rows generated in the browser |
| `/client-side-rendered/:id` | detail in the browser |
| `/ssr-throughput` | 1000 rows without links |
| `/initial-load` | shared landing page and CSS |
| `/rows` | rows as JSON |

## Run

```sh
npx mam bog/ssr
PORT=3000 node bog/ssr/-/node.js
```

Web-handler for benchmarks without TCP:

```js
const $ = require( './bog/ssr/-/node.js' )
const response = await $.$bog_ssr_handle( new Request( 'http://localhost/ssr-throughput' ) )
```

## Pages

https://b-on-g.github.io/ssr/ — the same server render done once in CI by `$bog_ssr_static( dir, base )`: every route is written as static HTML under the base path `/ssr/`, deep links fall back to `404.html`. Rendering is at build time here, not per request, but adoption and client routing work the same.

## Probe

```sh
npx mam bog/ssr bog/ssr/probe
node -e "require('./bog/ssr/probe/-/node.js').\$bog_ssr_probe_check()"
```

Opens `/server-side-rendered` in headless Chrome, counts table nodes removed or added after parsing, clicks the first link and checks client routing, then does the same on `/client-side-rendered`.
