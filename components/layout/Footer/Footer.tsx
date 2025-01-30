import Link from "next/link";

const Footer = () => {
  return (
    <footer className="">
      <div className="py-8 md:pt-[50px] bg-white">
        <div className="px-4 md:px-14 lg:px-20">
          <div className="flex justify-center items-center">
            <p className="text-sm text-center  text-foreground/60">
              &copy; 2025 CV. Service Tous droits réservés. Conçu par{" "}
              <Link
                href="https://freddymk-portfolio.vercel.app"
                className="text-foreground font-medium hover:underline"
              >
                Freddymk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
