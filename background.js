console.log("RA Checker background started");

// Optional: show extension installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("RA Checker installed");
});

// Optional: message listener for debugging
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg === "ping") {
    reply("pong");
  }
});
