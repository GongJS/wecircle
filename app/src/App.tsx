import React, { Suspense, lazy, useEffect } from 'react';
import {Loading} from 'redell-ui'
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import Store from './store'
import routers from './router'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const DEFAULT_SCENE_CONFIG = {
  enter: 'from-right',
  exit: 'to-exit'
};

const getSceneConfig = (location: any) => {
  const matchedRoute = routers.find(config => new RegExp(`^${config.path}$`).test(location.pathname));
  return (matchedRoute && matchedRoute.sceneConfig) || DEFAULT_SCENE_CONFIG;
};

let oldLocation: any;
const Routes = withRouter(({ location, history }) => {

  // 转场动画应该都是采用当前页面的sceneConfig，所以：
  // push操作时，用新location匹配的路由sceneConfig
  // pop操作时，用旧location匹配的路由sceneConfig
  let classNames = '';
  if (history.action === 'PUSH') {
    classNames = 'forward-' + getSceneConfig(location).enter;
  } else if (history.action === 'POP' && oldLocation) {
    classNames = 'back-' + getSceneConfig(oldLocation).exit;
  }

  // 更新旧location
  oldLocation = location;

  return (
    <TransitionGroup
      childFactory={child => React.cloneElement(child, { classNames })}>
      <CSSTransition timeout={500} key={location.pathname}>
        <Switch location={location}>
          {
            routers.map((item: any, index) => {
              const DynamicComponent = lazy(() => import(`${item.component}`));
              return <Route key={index} path={item.path} exact render={props => (
                <div className="layout-wrapper">
                  <Suspense fallback={<Loading name="spin" message="加载中..." ><div style={{width:'100vw',height: '100vh'}} /> </Loading>}>
                    {
                      !item.auth
                        ? (<DynamicComponent {...props} {...item} />)
                        : (localStorage.getItem('user')
                          ? (<DynamicComponent {...props}  {...item} />)
                          : (<Redirect to={{
                            pathname: "/login", state: { from: props.location }
                          }} />)
                        )
                    }
                  </Suspense>
                </div>
              )}>
              </Route>
            })
          }
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
});
const App: React.FC = (props) => {
  useEffect(() => {
    const app = document.getElementById("root");
    let touchstartY: number;
    app!.addEventListener("touchstart", function (event) {
      var events = event.touches[0] || event;
      touchstartY = events.clientY;//获取触摸目标在视口中的y坐标
    }, false);

    app!.addEventListener("touchmove", function (event) {
      const events = event.touches[0] || event;
      //注意document.body.scrollTop始终为0
      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;//获取滚动部分的高度
      const clientHeight = document.documentElement.clientHeight;//获取手机屏幕高度（可视部分高度）
      const scrollHeight = document.body.scrollHeight;//所有内容的高度

      // 只在首页起作用
      if (window.location.pathname === '/') {
        if (events.clientY > touchstartY && scrollTop === 0 && event.cancelable) {
          event.preventDefault();//禁止到顶下拉
        } else if (scrollTop + clientHeight > scrollHeight && event.cancelable) {
          event.preventDefault();//禁止到底上拉
        }
      }

    }, false);
  }, [])
  return (
    <Store>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Store>
  );
}

export default App;
