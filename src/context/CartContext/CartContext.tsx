import type { Product } from "../../utils/types";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { collect } from "../../utils/collection";

type CartEntry = {
  product: Product;
  quantity: number;
};

interface CartContextValues {
  entries: CartEntry[];
  addProduct: (product: Product, quantity?: number) => void;
  updateQuantity: (product: Product | number, delta?: number) => void;
  removeProduct: (product: Product | number) => void;
}

const initialValues = {
  entries: [],
  addProduct: () => {},
  updateQuantity: () => {},
  removeProduct: () => {}
};

export const CartContext = createContext<CartContextValues>(initialValues);

export const useCartContext = () => useContext(CartContext);

function AuthContextProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState(collect<CartEntry>({}));

  const addProduct = (product: Product, quantity: number = 1) => {
    const entry = entries.get(product.id);

    quantity = !entry ? quantity : entry.quantity + quantity;

    setEntries(entries.set(product.id, { product, quantity }));
  };

  const updateQuantity = (product: Product | number, delta: number = 1) => {
    const key = typeof product === "number" ? product : product.id;
    const entry = entries.get(key);

    if (!entry) {
      return;
    }

    const { product: existingProduct, quantity } = entry;
    const newQuantity = quantity + delta;

    if (newQuantity <= 0) {
      removeProduct(product);

      return;
    }

    setEntries(
      entries.set(key, {
        product: existingProduct,
        quantity: newQuantity
      })
    );
  };

  const removeProduct = (product: Product | number) => {
    const key = typeof product === "number" ? product : product.id;
    const entry = entries.get(key);

    if (!entry) {
      return;
    }

    setEntries(entries.delete(key));
  };

  return (
    <CartContext.Provider
      value={{
        entries: entries.toArray(),
        addProduct,
        updateQuantity,
        removeProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default AuthContextProvider;
