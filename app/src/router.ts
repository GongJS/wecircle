const routers = [
  {path: "/", name: "Index", component: './pages/index/Index', sceneConfig: {
    enter: 'from-right',
    exit: 'to-right'
  }},
  {path: "/login", name: "Login", component: './pages/login/Login', sceneConfig: {
    enter: 'from-bottom',
    exit: 'to-bottom'
  }}, 
  {path: "/info", name: "Info", component: './pages/info/Info',  auth:true,sceneConfig: {
    enter: 'from-right',
    exit: 'to-right'
  }},
  {path: "/chat", name: "Chat", component: './pages/chat/Chat',  auth:true,sceneConfig: {
    enter: 'from-right',
    exit: 'to-right'
  }},
  {path: "/chatlist", name: "ChatList", component: './pages/chatlist/ChatList',  auth:true,sceneConfig: {
    enter: 'from-right',
    exit: 'to-right'
  }},
  {path: "/person", name: "Person", component: './pages/person/Person', sceneConfig: {
    enter: 'from-right',
    exit: 'to-right'
  }},
  {path: "/post", name: "Post", component: './pages/post/Post',  auth:true,sceneConfig: {
    enter: 'from-right',
    exit: 'to-right'
  }},
]
export default routers