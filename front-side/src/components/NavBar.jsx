import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <Link to="/homepage" style={styles.logo}>
        Psychology Clinic
      </Link>
      <Link to="/login" style={styles.loginButton}>Login</Link>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
    innerWidth: "200%",
    marginTop: "0px"
  },
  logo: {
    fontSize: "20px",
    textDecoration: "none",
    color: "white",
  },
  loginButton: {
    padding: "8px 12px",
    backgroundColor: "red",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default Navbar;
