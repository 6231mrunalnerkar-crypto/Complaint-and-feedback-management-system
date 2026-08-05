import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        CFMS
      </div>

      <ul className="navLinks">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="navButtons">
        <button className="loginBtn">Login</button>
        <button className="registerBtn">Register</button>
      </div>
    </nav>
  );
}

export default Navbar;