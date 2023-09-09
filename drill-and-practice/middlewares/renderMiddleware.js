import { configure, renderFile } from "../deps.js";

const renderMiddleware = async (context, next) => {
  configure({
    views: `${Deno.cwd()}/views/`,
  });

  context.render = async (file, data) => {
    const user = await context.state.session.get("user");
    if (user) data.user = user;
    context.response.headers.set("Content-Type", "text/html; charset=utf-8");
    context.response.body = await renderFile(file, data);
  };

  await next();
};

export { renderMiddleware };
