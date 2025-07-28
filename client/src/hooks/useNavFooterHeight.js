import { useEffect } from "react";

// ✅ 함수명은 반드시 use로 시작해야 함
const useNavFooterHeight = (navSelector = "nav", footerSelector = "footer") => {
   useEffect(() => {
      const updateLayoutVars = () => {
         const nav = document.querySelector(navSelector);
         const footer = document.querySelector(footerSelector);

         const navHeight = nav?.offsetHeight || 0;
         const footerHeight = footer?.offsetHeight || 0;
         const vh = window.innerHeight;

         const contentHeight = vh - footerHeight;

         document.documentElement.style.setProperty(
            "--loginBoxHeight",
            `${contentHeight}px`
         );
         document.documentElement.style.setProperty(
            "--navHeight",
            `${navHeight}px`
         );
      };

      updateLayoutVars();
      window.addEventListener("resize", updateLayoutVars);
      return () => window.removeEventListener("resize", updateLayoutVars);
   }, [navSelector, footerSelector]);
};

export default useNavFooterHeight;
