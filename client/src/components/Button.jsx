import React from "react";
import clsx from "clsx";
const Button = ({ icon, className, label, type, onClick = () => 
{} }) => {
  return(
  <button type={type || "button"} className={clsx("px-3 px-y outline-none",className)} onClick={onClick}> 
    <span>{label}</span>
    {icon && icon}
  </button>
  )
};

export default Button;
