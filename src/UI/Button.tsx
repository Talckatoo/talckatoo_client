interface ButtonProps {
  type: "submit" | "button" | "reset" | undefined;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  type,
  children,
  className,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={` font-semibold py-3 px-5  ${className}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      onClick={onClick}
      disabled={disabled}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
