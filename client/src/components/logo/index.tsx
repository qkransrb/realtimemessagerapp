import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import logoSvg from "@/assets/whop-logo.svg";

interface LogoProps {
  url?: string;
  showText?: boolean;
  imgClass?: string;
  textClass?: string;
}

const Logo = ({
  url = "/",
  showText = true,
  imgClass = "size-[30px]",
  textClass,
}: LogoProps) => {
  return (
    <Link to={url} className="flex items-center gap-2 w-fit">
      <img src={logoSvg} alt="Whop" className={cn(imgClass)} />
      {showText ? (
        <span className={cn("font-semibold text-lg leading-tight", textClass)}>
          Whop.
        </span>
      ) : null}
    </Link>
  );
};

export default Logo;
