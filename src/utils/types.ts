export type Nullable<T> = T | null;

export type User = {
  id: string;
  username: string;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  currency: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};
