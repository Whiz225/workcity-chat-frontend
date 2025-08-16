import { BiLoaderAlt } from "react-icons/bi";

function SpinnerMini({ className = "w-[2.4rem] h-[2.4rem]", ...props }) {
  return (
    <BiLoaderAlt className={`w-6 h-6 animate-spin ${className}`} {...props} />
  );
}

export default SpinnerMini;
