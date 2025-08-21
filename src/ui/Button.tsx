import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "enlightened";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses = "rounded cursor-pointer";

  const disabledClasses =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-700 disabled:hover:bg-gray-400 disabled:border-gray-400";

  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-white text-black hover:bg-gray-300 border border-gray-300",
    enlightened: "bg-blue-300 text-black hover:bg-blue-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const combinedClasses = twMerge(
    baseClasses,
    disabledClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
