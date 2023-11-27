import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import styles from "./Cart.module.scss";
import { useMemo } from "react";

function Cart() {
  const { entries, removeProduct, updateQuantity } = useCartContext();

  const totalPrice = useMemo(
    () =>
      entries
        .reduce(
          (carry, { product: { price }, quantity }) => carry + quantity * price,
          0
        )
        .toFixed(2),
    [entries]
  );

  return (
    <>
      <div className={styles.title}>Tvoja korpa</div>
      <Link to="/products"></Link>
      <div className={styles.cart}>
        {entries.length === 0 ? (
          <>EMPTY CART</>
        ) : (
          <>
            {entries.map(({ product, quantity }) => {
              const { id, name, price } = product;

              return (
                <div key={id}>
                  <img src={`/images/${product.image}.jpg`} />
                  <h3>{name}</h3>
                  <div className={styles.actionsWrapper}>
                    <button
                      onClick={() => {
                        updateQuantity(product, -1);
                      }}
                    >
                      -
                    </button>
                    <p>{quantity}</p>
                    <button
                      onClick={() => {
                        updateQuantity(product, 1);
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => {
                        removeProduct(product);
                      }}
                      className={styles.remove}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="summary">
        <h3>SUMMARY</h3>
        <h5>Total price</h5>
        <p>{totalPrice}</p>
        <div></div>
        <Link to="/products">Nazad na kupovinu</Link>
      </div>
    </>
  );
}

export default Cart;
