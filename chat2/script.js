document.addEventListener("DOMContentLoaded", function () {
    // 选择重要的DOM元素
    const chatInput = document.querySelector(".chat-input textarea");
    const sendButton = document.querySelector(".fa-paper-plane");
    const micButton = document.querySelector(".fa-microphone");
    const chatBox = document.querySelector(".chat-box");
    const sidebar = document.querySelector(".sidebar");
    const collapseButton = document.querySelector(".collapse-button");
    const introText = document.querySelector(".intro-text");
    const welcomeText = document.querySelector(".chat-box > p");
    let chatStarted = false;
    let audioPlayer = null;
    let messageCount = 0; // 记录用户发送消息的次数

    // 预设回答
    const presetReplies = [
        "我是被二维化的人类墓碑上最后一个标点符号，是宇宙黑暗森林里举着火把跳舞的疯子，是两个文明天平上唯一未被蒸发的砝码。不过现在...（低头摩挲着腰间威慑控制器的纹路）只是个在末日钟摆下喝伏特加的守望者。或者说，是某个倒霉的大学教授，被选中在文明墓碑上刻墓志铭的可怜虫？",
        "黑暗森林？那不过是幼儿园沙盘游戏的宇宙版。（突然将酒塞按进雪地裂痕，鲜血在纯白中绽开玫瑰）我如何看待黑暗森林法则？就像古人类看待篝火旁游荡的狼群——既要感谢火光划出的安全区，又时刻恐惧着火焰熄灭后，自己瞳孔里闪烁的，究竟是守护者的余晖，还是掠食者的幽光。"
    ];

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

    // 初始化textarea并设置自动调整高度
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
                } else {
                    // 仅Enter键时发送消息并阻止换行
                    event.preventDefault();
                    sendSimpleMessage();
                }
            }
        });
    }

    // 自动调整textarea高度的函数
    function adjustTextareaHeight() {
        // 重置高度以获取正确的scrollHeight
        chatInput.style.height = "auto";
        
        // 设置新高度（有最小和最大高度限制）
        const newHeight = Math.min(Math.max(chatInput.scrollHeight, 40), 120);
        chatInput.style.height = newHeight + "px";
    }

    // 创建音频播放器
    function createAudioPlayer() {
        if (!audioPlayer) {
            audioPlayer = document.createElement("audio");
            audioPlayer.controls = true;
            audioPlayer.style.display = "none";
            document.body.appendChild(audioPlayer);
        }
        return audioPlayer;
    }

    // 添加消息到聊天框
    function appendMessage(sender, message, audioPaths = null) {
        // 第一次发送消息时，移除欢迎文字并调整聊天框大小
        if (!chatStarted) {
            welcomeText.style.display = "none";
            chatBox.classList.add("expanded");
            introText.style.display = "none";
            chatStarted = true;
        }
    
        // 确保聊天消息容器存在
        if (!chatBox.querySelector(".chat-messages")) {
            const messagesContainer = document.createElement("div");
            messagesContainer.classList.add("chat-messages");
            messagesContainer.style.overflowY = "auto";
            messagesContainer.style.flexGrow = "1";
            messagesContainer.style.maxHeight = "calc(100vh - 200px)"; // 调整高度
            messagesContainer.style.display = "flex";
            messagesContainer.style.flexDirection = "column";
            chatBox.insertBefore(messagesContainer, chatBox.querySelector(".chat-input"));
        }
    
        const messagesContainer = chatBox.querySelector(".chat-messages");
    
        if (sender === "user") {
            // 用户消息容器
            const userMessageContainer = document.createElement("div");
            userMessageContainer.className = "user-message-container";
            
            // 用户消息
            const messageElement = document.createElement("div");
            messageElement.className = "user-message";
            messageElement.textContent = message;
            
            userMessageContainer.appendChild(messageElement);
            messagesContainer.appendChild(userMessageContainer);
        } else {
            // AI消息样式添加头像和名字
            const aiMessageContainer = document.createElement("div");
            aiMessageContainer.className = "ai-message-container";
    
            // 创建AI头像
            const aiAvatar = document.createElement("img");
            aiAvatar.className = "ai-avatar";
            aiAvatar.src = "images/logic.jpeg"; 
            aiAvatar.alt = "罗辑";
    
            // 创建AI消息内容容器
            const aiMessageContent = document.createElement("div");
            aiMessageContent.className = "ai-message-content";
    
            // 创建AI名字
            const aiName = document.createElement("div");
            aiName.className = "ai-name";
            aiName.textContent = "罗辑";
    
            // 创建AI消息
            const aiMessage = document.createElement("div");
            aiMessage.className = "ai-message";
            aiMessage.textContent = message;
    
            // 如果有音频路径，添加多个播放按钮
            if (audioPaths && Array.isArray(audioPaths) && audioPaths.length > 0) {
                const audioWrapper = document.createElement("div");
                audioWrapper.className = "audio-wrapper";
                audioPaths.forEach((audioPath, idx) => {
                    const audioButton = document.createElement("button");
                    audioButton.className = "audio-button";
                    audioButton.innerHTML = `<i class="fas fa-play"></i> 播放${audioPaths.length > 1 ? idx + 1 : ""}`;
                    audioButton.addEventListener("click", function() {
                        const player = createAudioPlayer();
                        player.src = audioPath;
                        player.play();
                    });
                    audioWrapper.appendChild(audioButton);
                });
                aiMessageContent.appendChild(aiName);
                aiMessageContent.appendChild(aiMessage);
                aiMessageContent.appendChild(audioWrapper);
            } else {
                // 没有音频时，正常添加消息
                aiMessageContent.appendChild(aiName);
                aiMessageContent.appendChild(aiMessage);
            }
    
            // 组装AI消息结构
            aiMessageContainer.appendChild(aiAvatar);
            aiMessageContainer.appendChild(aiMessageContent);
    
            // 添加到消息容器
            messagesContainer.appendChild(aiMessageContainer);
        }
    
        // 滚动到最新消息
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 简化版发送消息功能
    function sendSimpleMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;
    
        appendMessage("user", userMessage);
        chatInput.value = "";
        
        // 重置textarea高度
        adjustTextareaHeight();
    
        // 添加加载指示器
        const loadingElement = document.createElement("div");
        loadingElement.className = "loading-indicator";
        loadingElement.textContent = "思考中";
    
        if (chatBox.querySelector(".chat-messages")) {
            const messagesContainer = chatBox.querySelector(".chat-messages");
            messagesContainer.appendChild(loadingElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    
        // 模拟延迟后显示AI回答
        setTimeout(() => {
            // 移除加载指示器
            if (chatBox.querySelector(".loading-indicator")) {
                chatBox.querySelector(".loading-indicator").remove();
            }
            
            // 根据消息计数展示预设回答
            let aiReply;
            if (messageCount < presetReplies.length) {
                aiReply = presetReplies[messageCount];
            } else {
                aiReply = "抱歉，我暂时只能回答前两个问题。";
            }
            messageCount++;
            
            // 添加生成音频的加载指示器
            const ttsLoadingElement = document.createElement("div");
            ttsLoadingElement.className = "tts-loading-indicator";
            ttsLoadingElement.textContent = "生成语音中";
            
            if (chatBox.querySelector(".chat-messages")) {
                const messagesContainer = chatBox.querySelector(".chat-messages");
                messagesContainer.appendChild(ttsLoadingElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
            // 模拟延迟后显示音频按钮
            setTimeout(() => {
                // 移除TTS加载指示器
                if (chatBox.querySelector(".tts-loading-indicator")) {
                    chatBox.querySelector(".tts-loading-indicator").remove();
                }
                
                // 模拟音频URL
                const mockAudioUrl = "#"; // 这里可以替换为实际的音频URL
                
                // 添加消息和音频按钮
                appendMessage("ai", aiReply, [mockAudioUrl]);
            }, 1600);
        }, 2000);
    }

    // 绑定发送按钮点击事件
    sendButton.addEventListener("click", sendSimpleMessage);

    // 为麦克风按钮添加简单点击事件
    micButton.addEventListener("click", function() {
        alert("语音输入功能已简化，请直接在输入框输入文字。");
    });
});