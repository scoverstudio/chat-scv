const socket = io();

const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = "";

const login = (e) => {
  e.preventDefault();
  if (userNameInput.value) {
    userName = userNameInput.value;
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  } else {
    alert("userName field required");
  }

  if (userName) {
    socket.emit("join", { name: userName, id: socket.id });
  }
};

const addMessage = (author, content) => {
  const message = document.createElement("li");
  message.classList.add("message");
  message.classList.add("message--received");
  if (author === userName) message.classList.add("message--self");
  message.innerHTML = `
  <h3 class="message__author">${userName === author ? "You" : author}</h3>
  <div class="message__content">
    ${content}
  </div>
`;
  messagesList.appendChild(message);
};

const sendMessage = (e) => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (messageContentInput.value) {
    addMessage(userName, messageContent);
    socket.emit("message", { author: userName, content: messageContent });

    messageContentInput.value = "";
  } else {
    alert("Message field required");
  }
};

socket.on("message", ({ author, content }) => addMessage(author, content));
socket.on("newUser", ({ name }) => {
  addMessage("chatBot", `${name} has joined the conversation!`);
});
socket.on("removeUser", ({ name }) => {
  addMessage("chatBot", `${name} has left the conversation... :(`);
});
loginForm.addEventListener("submit", login);
addMessageForm.addEventListener("submit", sendMessage);
