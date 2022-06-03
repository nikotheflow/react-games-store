import logoImg from '../assets/img/logo.png';
import cartImg from '../assets/img/cart.svg';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img className="logo-img" src={logoImg} width="32" height="32" alt="logo"></img>
        <span className="logo-title">Retro Games Store</span>
      </div>
      <button className="cart-btn btn__primary btn">
        <img className="cart-btn__img" src={cartImg} width="20" height="20" alt="cart"></img>
        <span>Cart: $100</span>
      </button>
    </header>
  );
}

export default Header;
