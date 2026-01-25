import React from 'react';
import Link from 'next/link';

// FIX: Kita balikin 'disabled' karena Link aslinya ga punya,
// tapi kita butuh itu buat logic styling.
// 'children' dan 'className' gausah ditulis lagi biar ngikut bawaan HTML.
interface BaseProps {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  href?: never;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, BaseProps {
  href: string;
}

type BrutButtonProps = ButtonProps | LinkProps;

const BrutButton = (props: BrutButtonProps) => {
  const {
    children,
    variant = 'primary',
    className = "",
    fullWidth = false,
    disabled = false,
    ...rest
  } = props;

  const baseStyles = [
    "inline-flex items-center justify-center",
    "border-brut border-main font-bold py-3 px-6",
    "transition-transform duration-75",
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-main/30",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0",
    "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:shadow-none",
    "text-base md:text-lg tracking-tight",
    "touch-manipulation",
    fullWidth ? "w-full" : "",
  ].join(" ");

  const hoverClass = disabled ? '' : 'brut-hover-effect';

  const variants = {
    primary: "bg-accent shadow-brut text-main",
    secondary: "bg-surface shadow-brut text-main",
    danger: "bg-danger text-white shadow-brut",
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${hoverClass} ${className}`;

  if ('href' in props && props.href) {
    const { href, ...linkRest } = rest as LinkProps;

    if (disabled) {
      return (
        <span
          className={finalClass}
          aria-disabled="true"
          role="link"
          tabIndex={-1}
        >
          {children}
        </span>
      );
    }

    return (
      <Link href={href} className={finalClass} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={finalClass}
      disabled={disabled}
      type="button"
      {...(rest as ButtonProps)}
    >
      {children}
    </button>
  );
};

export default BrutButton;
