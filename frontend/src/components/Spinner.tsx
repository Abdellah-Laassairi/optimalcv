type SpinnerProps = {
  className?: string;
};

export default function Spinner({ className = "" }: SpinnerProps) {
  return <span className={`acv-spinner ${className}`} aria-label="loading" />;
}
