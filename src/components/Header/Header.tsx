import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Header.module.scss";

function Header() {
  const { user, logout } = useAuthContext();

  const isLoggedIn = user !== null;

  return (
    <header className={styles.header}>
      {isLoggedIn ? (
        <>
          <img src="/icons/logo.svg" />
          <div className={styles.headerActions}>
            <Link to={"/cart"} className={styles.cart}></Link>
            <button style={{ float: "right", margin: "24px" }} onClick={logout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
        </>
      )}
    </header>
  );
}

export default Header;
