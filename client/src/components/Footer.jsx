import "./css/Footer.css";
import logo from "../assets/logo2.png";

function Footer() {
   return (
      <footer id="footer">
         <div className="footer-container">
            <div className="footer-info">
               <img src={logo} />
               <p>본페이지는 네이버 웹툰 굿즈스토어 리뉴얼 웹페이지 입니다.</p>
               <p>Link: https://brand.naver.com/webtoonfriends</p>
               <p>© 2025 MyShop. All rights not reserved.</p>
            </div>
         </div>
      </footer>
   );
}
export default Footer;
