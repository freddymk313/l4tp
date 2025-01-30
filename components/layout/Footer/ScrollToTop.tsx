"use client";

import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { ChevronUp } from "lucide-react";

export const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
    });
  };

  return (
    <>
      {showTopBtn && (
        <button
          onClick={goToTop}
          className="fixed bottom-4 right-4 p-2 shadow-md bg-primary rounded-lg"
          // size="icon"
        >
          <ChevronUp size={20} className="text-primary-foreground" />
        </button>
      )}
    </>
  );
};
