import { file, serve } from "bun";
import index from "./src/index.html";
import login from "./src/login.html";
import rule  from "./src/rule.html";

const server = serve({
    routes: {
        "/": index,
        "/login": login,
        "/rule": rule,
    },
    fetch: req => new Response(file(new URL(req.url).pathname.substring(1)))
})

console.log(`Running at ${server.url}`);
