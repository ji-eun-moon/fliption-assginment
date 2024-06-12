export type AccessTokenPayload = {
  id: string;
};

export type RefreshTokenPayload = {
  id: string;
  isRefreshToken: true;
};
