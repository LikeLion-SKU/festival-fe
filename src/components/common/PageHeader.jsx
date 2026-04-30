import BackButton from '@/components/common/Button/BackButton';

export default function PageHeader({
  title,
  to,
  onBack,
  onTitleClick,
  rightElement,
  top = '6dvh',
  className = '',
}) {
  return (
    <header
      className={`absolute left-0 right-0 flex items-center justify-center h-[3.5rem] ${className}`}
      style={{ top }}
    >
      <BackButton to={to} onClick={onBack} fixed={false} className="absolute left-[1.25rem]" />
      <h1
        className="text-white text-[1.125rem] font-semibold"
        style={{ letterSpacing: '-0.025em', cursor: onTitleClick ? 'pointer' : 'default' }}
        onClick={onTitleClick}
      >
        {title}
      </h1>
      {rightElement && <div className="absolute right-[1.25rem]">{rightElement}</div>}
    </header>
  );
}
