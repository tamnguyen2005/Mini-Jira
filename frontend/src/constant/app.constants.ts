export const ROUTES = {
  root: "/",
  home: "/home",
  login: "/login",
  register: "/register",
} as const;

export const STORAGE_KEYS = {
  auth: "auth-storage",
  board: "board-storage",
} as const;

export const QUERY_PARAMS = {
  title: "title",
  assigneeId: "assigneeId",
  priority: "priority",
  dueFrom: "dueFrom",
  dueTo: "dueTo",
} as const;
