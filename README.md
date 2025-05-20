> 最初是一个前端网页与deepseek接入用于测试，后续又实现了不同的场景，用于不同人物的对话等模拟，或者不同系统的前端展示界面。我发现他的应用场景可以一直拓展，只需要做简单的改动即可。经过调研与实际操作发现，已有的针对大模型对话的webui比较难以部署与改动，对于初学者来说难以理解使用，并且仅通过当今大模型生成的前端布局往往不能如用户所想那样完美，因此提出了EZchatUI。该页面通过只使用html，css，js，就可以提供一个实现效果较为不错的页面展示，后续打算将它应用为一个模板，用户只需要将少量的文件发给AI，进行简单的改动描述就可以快速的美观的应用于你的前端展示页面

### 代码简介
- 通过前端实现了一个简单的聊天网页，Chatbot_dpsk接入了deepseek可以进行问答，chat， chat2根据不同的对话人物，设计不同的界面风格。代码用于调整测试布局外观，以便后续增加和展示功能。
- 同时作为一个简单的前端界面模板，提供了针对于大模型对话前端所需要的基本元素，只需要将chat3内的文件发给AI，通过提示词描述功能让AI进行修改，就可以实现快速的前端制作

### 如何运行后端
在终端中先切换至后端目录
```
cd .../backend
```
然后启动后端服务器
```
npm start
```
运行前端需要在html页面代码中右键打开 live server 插件

通过ctrlC来停止运行

### 页面展示
- chat_deepseek:
![presentation](Chatbot_dpsk/frontend/images/web1.png)
- chat:
![presentation](Chatbot_dpsk/frontend/images/anst.png)
- chat2:
![presentation](Chatbot_dpsk/frontend/images/web2.png)
- chat3:
![presentation](Chatbot_dpsk/frontend/images/web3.png)
