// SECTION: Mock Data
const friends = [
  {
    id: "ari",
    name: "Ari Patel",
    status: "Online",
    presence: "online",
    lastSeen: "Now",
    preview: "Can you send me that playlist?",
    messages: [
      {
        from: "friend",
        text: "Hey! Ready for tonight?",
        time: "7:42 pm",
      },
      {
        from: "self",
        text: "Absolutely. What time are we meeting?",
        time: "7:43 pm",
      },
      {
        from: "friend",
        text: "Let's say 8:30 at the usual place.",
        time: "7:44 pm",
      },
    ],
  },
  {
    id: "lena",
    name: "Lena Ortiz",
    status: "Typing sometimes",
    presence: "away",
    lastSeen: "2h",
    preview: "This UI is looking so good 👀",
    messages: [
      {
        from: "friend",
        text: "Your portfolio layout is coming together nicely.",
        time: "3:16 pm",
      },
      {
        from: "self",
        text: "Thanks! Still tweaking the colors.",
        time: "3:18 pm",
      },
    ],
  },
  {
    id: "max",
    name: "Max Chen",
    status: "Offline • last seen 5m ago",
    presence: "offline",
    lastSeen: "5m",
    preview: "We should plan a game night soon.",
    messages: [
      {
        from: "friend",
        text: "We should plan a game night soon.",
        time: "10:02 am",
      },
      {
        from: "self",
        text: "Yes please. I'll bring snacks.",
        time: "10:04 am",
      },
    ],
  },
];

// SECTION: State
let activeFriendId = null;

// SECTION: DOM References
const friendListEl = document.getElementById("friendList");
const friendSearchEl = document.getElementById("friendSearch");
const chatMessagesEl = document.getElementById("chatMessages");
const emptyStateEl = document.getElementById("emptyState");
const messageFormEl = document.getElementById("messageForm");
const messageInputEl = document.getElementById("messageInput");
const sendButtonEl = document.getElementById("sendButton");

const activeFriendHeaderEl = document.getElementById("activeFriendHeader");
const headerAvatarEl = activeFriendHeaderEl.querySelector("[data-avatar]");
const headerNameEl = activeFriendHeaderEl.querySelector("[data-name]");
const headerStatusEl = activeFriendHeaderEl.querySelector("[data-status]");

// SECTION: Rendering Helpers
function createAvatarInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderFriendList(items) {
  friendListEl.innerHTML = "";

  items.forEach((friend) => {
    const li = document.createElement("li");
    li.className = "friend-list-item";
    li.dataset.friendId = friend.id;

    const avatar = document.createElement("div");
    avatar.className = "friend-list-item__avatar";
    const initials = document.createElement("div");
    initials.className = "avatar__initials";
    initials.textContent = createAvatarInitials(friend.name);
    avatar.appendChild(initials);

    const content = document.createElement("div");
    content.className = "friend-list-item__content";

    const topRow = document.createElement("div");
    topRow.className = "friend-list-item__top";

    const nameEl = document.createElement("div");
    nameEl.className = "friend-list-item__name";
    nameEl.textContent = friend.name;

    const timeEl = document.createElement("div");
    timeEl.className = "friend-list-item__time";
    timeEl.textContent = friend.lastSeen;

    topRow.appendChild(nameEl);
    topRow.appendChild(timeEl);

    const previewRow = document.createElement("div");
    previewRow.className = "friend-list-item__preview";
    previewRow.textContent = friend.preview;

    content.appendChild(topRow);
    content.appendChild(previewRow);

    const presenceDot = document.createElement("div");
    presenceDot.className = "friend-list-item__status-dot";
    if (friend.presence === "away") {
      presenceDot.classList.add("friend-list-item__status-dot--away");
    } else if (friend.presence === "offline") {
      presenceDot.classList.add("friend-list-item__status-dot--offline");
    }

    li.appendChild(avatar);
    li.appendChild(content);
    li.appendChild(presenceDot);

    li.addEventListener("click", () => {
      setActiveFriend(friend.id);
    });

    friendListEl.appendChild(li);
  });

  highlightActiveFriend();
}

function renderHeader(friend) {
  if (!friend) return;
  const initials = createAvatarInitials(friend.name);

  headerAvatarEl.innerHTML = "";
  headerAvatarEl.className = "avatar avatar--lg";

  const initialsEl = document.createElement("div");
  initialsEl.className = "avatar__initials";
  initialsEl.textContent = initials;

  const ringEl = document.createElement("div");
  ringEl.className = "avatar__status-ring";

  headerAvatarEl.appendChild(initialsEl);
  headerAvatarEl.appendChild(ringEl);

  headerNameEl.textContent = friend.name;
  headerStatusEl.textContent = friend.status;
}

function renderMessages(friend) {
  chatMessagesEl.innerHTML = "";

  friend.messages.forEach((message) => {
    const row = document.createElement("div");
    row.className = "chat-message-row";
    if (message.from === "self") {
      row.classList.add("chat-message-row--self");
    }

    const bubble = document.createElement("div");
    bubble.className =
      "chat-message " +
      (message.from === "self" ? "chat-message--self" : "chat-message--friend");
    bubble.textContent = message.text;

    const meta = document.createElement("div");
    meta.className = "chat-message__meta";

    const senderEl = document.createElement("span");
    senderEl.className = "chat-message__sender";
    senderEl.textContent = message.from === "self" ? "You" : friend.name.split(" ")[0];

    const timeEl = document.createElement("span");
    timeEl.className = "chat-message__time";
    timeEl.textContent = message.time;

    meta.appendChild(senderEl);
    meta.appendChild(timeEl);

    const column = document.createElement("div");
    column.appendChild(bubble);
    column.appendChild(meta);

    row.appendChild(column);
    chatMessagesEl.appendChild(row);
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function highlightActiveFriend() {
  const items = friendListEl.querySelectorAll(".friend-list-item");
  items.forEach((item) => {
    if (item.dataset.friendId === activeFriendId) {
      item.classList.add("friend-list-item--active");
    } else {
      item.classList.remove("friend-list-item--active");
    }
  });
}

// SECTION: Core Logic
function setActiveFriend(friendId) {
  if (activeFriendId === friendId) return;
  activeFriendId = friendId;

  const friend = friends.find((f) => f.id === friendId);
  if (!friend) return;

  // Hide empty state and render chat
  if (emptyStateEl) {
    emptyStateEl.style.display = "none";
  }

  renderHeader(friend);
  renderMessages(friend);
  highlightActiveFriend();

  messageInputEl.focus();
}

function appendMessageToActiveFriend(text) {
  if (!activeFriendId || !text.trim()) return;
  const friend = friends.find((f) => f.id === activeFriendId);
  if (!friend) return;

  const time = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const newMessage = {
    from: "self",
    text: text.trim(),
    time,
  };

  friend.messages.push(newMessage);
  friend.preview = text.trim();
  friend.lastSeen = "Now";

  renderMessages(friend);
  renderFriendList(filteredFriends());
}

// Simple mock reply behavior
function scheduleMockReply(friend) {
  const replies = [
    "Haha I love that.",
    "Ok, that works for me.",
    "Let's do it!",
    "I'll check and let you know.",
    "This chat app looks so clean.",
  ];

  const replyText = replies[Math.floor(Math.random() * replies.length)];

  setTimeout(() => {
    // If user switched chats, still deliver to the right conversation
    friend.messages.push({
      from: "friend",
      text: replyText,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    });
    friend.preview = replyText;
    friend.lastSeen = "Now";

    // Re-render current active chat if it matches
    if (friend.id === activeFriendId) {
      renderMessages(friend);
    }
    renderFriendList(filteredFriends());
  }, 800 + Math.random() * 1200);
}

// SECTION: Search / Filtering
function filteredFriends() {
  const query = friendSearchEl.value.trim().toLowerCase();
  if (!query) return friends;
  return friends.filter((f) => f.name.toLowerCase().includes(query));
}

function handleFriendSearch() {
  renderFriendList(filteredFriends());
}

// SECTION: Event Handlers
if (friendSearchEl) {
  friendSearchEl.addEventListener("input", handleFriendSearch);
}

if (messageFormEl) {
  messageFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = messageInputEl.value;
    if (!text.trim() || !activeFriendId) return;

    const friend = friends.find((f) => f.id === activeFriendId);
    if (!friend) return;

    appendMessageToActiveFriend(text);
    scheduleMockReply(friend);
    messageInputEl.value = "";
  });
}

// SECTION: Initialize
renderFriendList(friends);

// Auto-select first friend on load
if (friends.length > 0) {
  setActiveFriend(friends[0].id);
}
