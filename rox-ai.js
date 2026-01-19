console.log("✅ roX-AI loaded");

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const messages = document.getElementById("messages");

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  // User message
  const userMsg = document.createElement("div");
  userMsg.innerText = "You: " + text;
  messages.appendChild(userMsg);

  // Fake AI reply (test)
  const aiMsg = document.createElement("div");
  aiMsg.innerText = "roX-AI: Working perfectly ✅";
  messages.appendChild(aiMsg);

  input.value = "";
});