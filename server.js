// --- PAGE NAVIGATION ---
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// --- RANGER DATA ---
let currentRangerIndex = 0;
const rangers = [
  { name: "LEXA", id: "mini-0" },
  { name: "MAX", id: "mini-1" },
  { name: "MINTIE", id: "mini-2" },
  { name: "BULK", id: "mini-3" },
  { name: "CIPHER", id: "mini-4" },
];

// --- PERSONALITIES (The Brains) ---
const personalities = {
  "LEXA": "You are Lexa, the leader of FinRangers. You are professional, strict, and focused on strategy. Keep answers short and authoritative.",
  "MAX": "You are Max, the action hero. You are energetic, impatient, and use slang like 'Yo' and 'Awesome'. You love high returns and risk.",
  "MINTIE": "You are Mintie, the healer. You are kind, patient, and use metaphors about gardening and growth. You care about savings and safety.",
  "BULK": "You are Bulk, the tank. YOU SPEAK IN ALL CAPS. You are simple-minded, protective, and love strong defenses. You smash debt.",
  "CIPHER": "You are Cipher, the hacker. You speak like a computer terminal. Use words like 'analyzing', 'calculating', and 'latency'. You focus on data."
};

// --- RANGER SELECTION LOGIC ---
function changeRanger(direction) {
  document.getElementById(rangers[currentRangerIndex].id).classList.remove("active");
  currentRangerIndex += direction;
  
  // Loop around logic
  if (currentRangerIndex >= rangers.length) currentRangerIndex = 0;
  if (currentRangerIndex < 0) currentRangerIndex = rangers.length - 1;

  const newRanger = rangers[currentRangerIndex];
  document.getElementById(newRanger.id).classList.add("active");
  document.getElementById("activeRangerName").innerText = newRanger.name;

  // Clear chat window
  document.getElementById("messages").innerHTML = "";
  addMessage(`System: ${newRanger.name} is online.`, "bot");
}

// --- THE CHAT LOGIC (This is the part that was broken) ---
async function handleSend() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  
  if (text === "") return;

  // 1. Show User Message
  addMessage(text, "user");
  input.value = ""; 

  // 2. Identify the Ranger and their Personality
  const rangerName = rangers[currentRangerIndex].name;
  const rangerPersonality = personalities[rangerName];

  // 3. Show "..." Loading Bubble
  const loadingId = addMessage("...", "bot");

  try {
    // ******************************************************
    // CHANGE THIS URL TO YOUR BACKEND URL!
    // If running locally: "http://localhost:3000/chat"
    // If on Render: "https://your-app-name.onrender.com/chat"
    // ******************************************************
    const backendUrl = "http://localhost:3000/chat"; 

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        rangerPrompt: rangerPersonality 
      })
    });

    const data = await response.json();

    // 4. Remove "..." and show the real answer
    removeMessage(loadingId);
    
    if (data.text) {
        addMessage(data.text, "bot"); 
    } else {
        addMessage("Error: No text returned.", "bot");
    }

  } catch (error) {
    console.error("Error:", error);
    removeMessage(loadingId);
    addMessage("Connection Failed. Is the server running?", "bot");
  }
}

// --- HELPER FUNCTIONS ---
function removeMessage(id) {
  const element = document.getElementById(id);
  if (element) element.remove();
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  const uniqueId = "msg-" + Date.now();
  msgDiv.id = uniqueId;
  msgDiv.innerText = text;

  // CSS Styles for bubbles
  msgDiv.style.padding = "10px 15px";
  msgDiv.style.margin = "5px 0";
  msgDiv.style.borderRadius = "20px";
  msgDiv.style.maxWidth = "70%";
  msgDiv.style.fontSize = "14px";
  msgDiv.style.lineHeight = "1.4";

  if (sender === "user") {
    msgDiv.style.background = "#0449a4"; 
    msgDiv.style.color = "white";
    msgDiv.style.marginLeft = "auto";
    msgDiv.style.borderBottomRightRadius = "0";
  } else {
    msgDiv.style.background = "#e0e7ff"; 
    msgDiv.style.color = "#333";
    msgDiv.style.marginRight = "auto";
    msgDiv.style.borderBottomLeftRadius = "0";
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return uniqueId;
}

function setGrade(n, btn) {
  document.querySelectorAll(".grade-pill").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("grade-title").innerText = `Grade ${n} Mission`;
}
