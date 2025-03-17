import { importShared } from './__federation_fn_import-D_SMhnIJ.js';
import UserComponent, { j as jsxRuntimeExports } from './__federation_expose_UserComponent-dXEkM4Vt.js';
import { r as reactDomExports } from './__federation_shared_react-dom-6cCw-6Kw.js';

var client$1 = {};

var m = reactDomExports;
{
  client$1.createRoot = m.createRoot;
  client$1.hydrateRoot = m.hydrateRoot;
}

function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "App", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserComponent, {}) });
}

const React = await importShared('react');
const {ApolloClient,InMemoryCache,ApolloProvider} = await importShared('@apollo/client');

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // Set this to your actual GraphQL endpoint
  cache: new InMemoryCache()
});
client$1.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ApolloProvider, { client, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
