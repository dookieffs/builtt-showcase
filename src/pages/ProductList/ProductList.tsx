import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/shop";
import { useCartContext } from "../../context/CartContext";
import { Product } from "../../utils/types";
import { useState } from "react";
import { collect } from "../../utils/collection";
import { Link } from "react-router-dom";
import styles from "./ProductList.module.scss";

function ProductList() {
  const { addProduct } = useCartContext();

  const [productQuantities, setProductQuantities] = useState(
    collect({} as Record<number, number>)
  );

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  const handleQuantityChange = (product: Product | number, delta: number) => {
    const key = typeof product === "number" ? product : product.id;

    const quantity = productQuantities.get(key) ?? 1;

    setProductQuantities(
      productQuantities.set(key, Math.max(1, quantity + delta))
    );
  };

  const handleAddToCart = (product: Product) => {
    setProductQuantities(productQuantities.set(product.id, 1));

    addProduct(product, productQuantities.get(product.id) ?? 1);
  };

  if (isLoading) {
    return <>Loading products...</>;
  }

  return (
    <>
      <div className={styles.title}>
        Svi proizvodi
        <span>{products?.length} proizvoda</span>
      </div>
      <div className={styles.gridContainer}>
        {products?.map((product) => (
          <div key={product.id} className="">
            <div style={{ position: "relative" }}>
              <img src={`/images/product_${product.id}.jpg`} />
              <div className={styles.actionsWrapper}>
                <button
                  onClick={() => {
                    handleQuantityChange(product, -1);
                  }}
                >
                  -
                </button>
                <p>{productQuantities.get(product.id) ?? 1}</p>
                <button
                  onClick={() => {
                    handleQuantityChange(product, 1);
                  }}
                >
                  +
                </button>

                <button
                  onClick={() => {
                    handleAddToCart(product);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <h3 className="">{product.name}</h3>
            <p className={styles.priceFormat}>
              {product.price} <span>{product.currency}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductList;
