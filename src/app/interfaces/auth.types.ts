export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserAuth {
  isAuth: boolean;
  isAdmin: boolean;
  user: UserInfo | undefined;
}

export interface UserInfo {
  username: string;
}

export interface TokenPayload {
  sub: string;
  isAdmin: boolean;
  exp: number;
  [key: string]: any;
}
