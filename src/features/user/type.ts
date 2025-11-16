export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  roles?: {
    admin?: boolean;
    sgd?: boolean;
  };
};

export type UserStore = {
  user?: User;
  handling: boolean;
};

export type UserStoreActions = {
  authUser: () => Promise<void>;
  logout: () => Promise<void>;
};
