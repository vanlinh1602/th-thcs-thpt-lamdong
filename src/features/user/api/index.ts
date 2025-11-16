import { getAuth } from 'firebase/auth';

import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { User } from '../type';

export const authUser = async (): Promise<User> => {
  const user = getAuth().currentUser;
  if (!user) {
    return Promise.reject('User not found');
  }

  const token = await user.getIdToken();

  const response = await backendService.post<User>('/users/auth', {
    email: user.email,
    name: user.displayName,
    avatar: user.photoURL,
    token,
  });

  if (response.kind === 'ok') {
    return response.data;
  }

  throw new Error(formatError(response));
};

export const logout = async (): Promise<void> => {
  const response = await backendService.post<void>('/users/logout');
  if (response.kind === 'ok') {
    return;
  }

  throw new Error(formatError(response));
};
