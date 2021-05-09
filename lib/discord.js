const fetch = require("isomorphic-fetch");

module.exports = {
  authorizationURL: (googleId) => {
    return (
      `https://discord.com/api/oauth2/authorize?response_type=code` +
      `&client_id=${encodeURIComponent(process.env.DISCORD_OAUTH_CLIENT_ID)}` +
      `&scope=${encodeURIComponent("email identify")}` +
      `&state=${encodeURIComponent(googleId)}` +
      `&redirect_uri=${encodeURIComponent(process.env.DISCORD_CALLBACK_URL)}` +
      `&prompt=consent`
    );
  },
  codeExchange: async (code) => {
    const authData = await (
      await fetch(`https://discord.com/api/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `client_id=${encodeURIComponent(
            process.env.DISCORD_OAUTH_CLIENT_ID
          )}` +
          `&client_secret=${encodeURIComponent(
            process.env.DISCORD_OAUTH_CLIENT_SECRET
          )}` +
          `&grant_type=authorization_code` +
          `&code=${encodeURIComponent(code)}` +
          `&redirect_uri=${encodeURIComponent(
            process.env.DISCORD_CALLBACK_URL
          )}`,
      })
    ).json();

    return authData;
  },
  getUserData: async (accessToken) => {
    const userData = await (
      await fetch(`https://discord.com/api/users/@me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    ).json();

    return userData;
  },
};
