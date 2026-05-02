export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={`relative  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
