document.addEventListener("DOMContentLoaded", function () {
    // 将input选择器更新为textarea
    const chatInput = document.querySelector(".chat-input textarea");
    const sendButton = document.querySelector(".fa-paper-plane");
    const chatBox = document.querySelector(".chat-box");
    const sidebar = document.querySelector(".sidebar");
    const collapseButton = document.querySelector(".collapse-button");
    const introText = document.querySelector(".intro-text");
    const welcomeText = document.querySelector(".chat-box > p");
    let chatStarted = false;

    // 初始化textarea
    initTextarea();
    
    // 侧边栏收起与展开功能
    collapseButton.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
        
        if(sidebar.classList.contains("collapsed")) {
            collapseButton.classList.remove("fa-bars");
            collapseButton.classList.add("fa-chevron-right");
        } else {
            collapseButton.classList.remove("fa-chevron-right");
            collapseButton.classList.add("fa-bars");
        }
    });

    // 新增：初始化textarea并设置自动调整高度
    function initTextarea() {
        // 设置初始高度
        adjustTextareaHeight();
        
        // 监听input事件以调整高度
        chatInput.addEventListener("input", adjustTextareaHeight);
        
        // 监听keydown事件处理Shift+Enter
        chatInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                if (event.shiftKey) {
                    // Shift+Enter插入换行，不发送消息
                    // 默认行为会插入换行，不需要额外处理
                } else {
                    // 仅Enter键时发送消息并阻止换行
                    event.preventDefault();
                    sendMessage();
                }
            }
        });
    }

    // 新增：自动调整textarea高度的函数
    function adjustTextareaHeight() {
        // 重置高度以获取正确的scrollHeight
        chatInput.style.height = "auto";
        
        // 设置新高度（有最小和最大高度限制）
        const newHeight = Math.min(Math.max(chatInput.scrollHeight, 40), 120);
        chatInput.style.height = newHeight + "px";
    }
    
    function appendMessage(sender, message) {
        // 第一次发送消息时，移除欢迎文字并调整聊天框大小
        if (!chatStarted) {
            welcomeText.style.display = "none";
            chatBox.classList.add("expanded");
            introText.style.display = "none";
            chatStarted = true;
        }

        // Create message container
        const messageContainer = document.createElement("div");
        messageContainer.classList.add(sender === "user" ? "user-message-container" : "ai-message-container");

        // Create message element
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender === "user" ? "user-message" : "ai-message");
        messageElement.textContent = message;

        if (sender === "ai") {
            // Create avatar
            const avatar = document.createElement("img");
            avatar.src = "images/character.jpg";
            avatar.alt = "AI character";
            avatar.classList.add("ai-avatar");
            // Append avatar and message to container
            messageContainer.appendChild(avatar);
            messageContainer.appendChild(messageElement);
        } else {
            // For user messages, only append the message element
            messageContainer.appendChild(messageElement);
        }

        if (!chatBox.querySelector(".chat-messages")) {
            const messagesContainer = document.createElement("div");
            messagesContainer.classList.add("chat-messages");
            messagesContainer.style.overflowY = "auto";
            messagesContainer.style.flexGrow = "1";
            messagesContainer.style.maxHeight = "calc(100vh - 200px)";
            messagesContainer.style.display = "flex";
            messagesContainer.style.flexDirection = "column";
            chatBox.insertBefore(messagesContainer, chatBox.querySelector(".chat-input"));
        }

        const messagesContainer = chatBox.querySelector(".chat-messages");
        messagesContainer.appendChild(messageContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        appendMessage("user", userMessage);
        chatInput.value = "";

        // 重置textarea高度
        adjustTextareaHeight();
        
        // Add loading indicator
        const loadingContainer = document.createElement("div");
        loadingContainer.classList.add("ai-message-container");
        const loadingElement = document.createElement("div");
        loadingElement.className = "loading-indicator";
        loadingElement.textContent = "思考中...";
        const avatar = document.createElement("img");
        avatar.src = "images/character.jpg";
        avatar.alt = "AI character";
        avatar.classList.add("ai-avatar");
        loadingContainer.appendChild(avatar);
        loadingContainer.appendChild(loadingElement);

        if (chatBox.querySelector(".chat-messages")) {
            const messagesContainer = chatBox.querySelector(".chat-messages");
            messagesContainer.appendChild(loadingContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // 调用后端 API
        fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading indicator
            if (chatBox.querySelector(".loading-indicator")) {
                chatBox.querySelector(".loading-indicator").parentElement.remove();
            }

            if (data.error) {
                appendMessage("ai", "抱歉，出现了错误: " + data.error);
            } else {
                appendMessage("ai", data.reply);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("ai", "抱歉，出现了错误，请稍后再试。");
        });
    }

    sendButton.addEventListener("click", sendMessage);
});