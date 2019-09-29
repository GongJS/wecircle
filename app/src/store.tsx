import React, { createContext, useReducer } from "react";

interface State {
  [propName: string]: any;
}
interface Context {
  [propName: string]: any;
}
type Action = { type: 'initCirclePost', postList: [] } | { type: 'addCirclePost', postList: [] } | { type: 'updateCirclePost', post: any }

const initState = {
  postList: []
}
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'initCirclePost':
      return {
        postList: action.postList
      }
    case 'addCirclePost':
      return {
        postList: state.postList.concat(action.postList)
      }
    case 'updateCirclePost':
      let id: string
      let idx: number = 0
      let copy:any[] = []
      if (action && action.post) {
        id = action.post._id
        state.postList.forEach((f: any, index: number) => {
          if (f._id === id) {
            idx = index
          }
        })
        copy = [...state.postList]
        copy.splice(idx, 1, action.post)
      }
      return {
        postList: copy
      }
    default:
      return state
  }
}
export const StoreContext = createContext<Context>({});

const Store: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initState)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default Store