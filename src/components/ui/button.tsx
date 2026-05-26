import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-primary-600 text-white hover:bg-primary-700",
      secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
      outline:
        "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
      ghost: "hover:bg-gray-100 text-gray-900",
      link: "text-primary-600 underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-lg",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(classes, children.props.className),
        ...props,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button
        type="button"
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
