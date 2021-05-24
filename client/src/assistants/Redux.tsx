export const ACTIONS = {
  ADD_TODO: "add-todo",
  TOGGLE_TODO: "toggle-todo",
  DELETE_TODO: "remove-todo",
  SET_SETTINGS: "set-settings",
  ADD_GAME: "add-game",
};

export interface TypeRedux {
  todos: ReduxState[];
  dispatch: Function;
  user: { username: string; setUsername: Function };
  games: [];
}

export interface ReduxState {
  id?: Date;
  username: string;
  complete?: boolean;
  settings?: string;
  games?: any[];
}

export function reducer(
  todos: ReduxState[],
  action: { payload: ReduxState; type: string }
) {
  let { type, payload } = action;
  let { ADD_TODO, TOGGLE_TODO, DELETE_TODO, SET_SETTINGS, ADD_GAME } = ACTIONS;

  switch (type) {
    case ADD_TODO:
      let newTodosForAdd = [newTodo(payload)];
      localStorage.setItem("todos", JSON.stringify(newTodosForAdd));
      return newTodosForAdd;
    case TOGGLE_TODO:
      let newTodosForToggle = todos.map((todo) => {
        if (todo.id === payload.id) {
          return { ...todo, complete: !todo.complete };
        }
        return todo;
      });
      localStorage.setItem("todos", JSON.stringify(newTodosForToggle));
      return newTodosForToggle;
    case DELETE_TODO:
      let newTodosForDelete = todos.filter((todo) => todo.id !== payload.id);
      localStorage.setItem("todos", JSON.stringify(newTodosForDelete));
      return newTodosForDelete;
    case SET_SETTINGS:
      let newTodosForSettings = todos.map((todo) => {
        if (todo.username === payload.username) {
          return { ...todo, settings: payload.settings };
        }
        return todo;
      });
      localStorage.setItem("todos", JSON.stringify(newTodosForSettings));
      return newTodosForSettings;
    case ADD_GAME:
      let newTodosForAddGame = todos.map((todo) => {
        if (todo.username === payload.username) {
          let newGames: any[] = [];
          if (todo.games) {
            newGames = todo.games;
          }
          newGames = [...newGames, payload.games];
          return { ...todo, games: newGames };
        }
        return todo;
      });
      localStorage.setItem("todos", JSON.stringify(newTodosForAddGame));
      return newTodosForAddGame;
    default:
      return todos;
  }
}

function newTodo(reduxState: ReduxState) {
  let newTodo: ReduxState = {
    id: new Date(),
    username: reduxState.username,
    complete: false,
    settings: reduxState.settings || `{"height":9,"width":9,"mines":10}`,
  };
  return newTodo;
}
