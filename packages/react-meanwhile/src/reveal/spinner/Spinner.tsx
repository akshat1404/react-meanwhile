import './spinner.css';

export interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color = 'currentColor' }: SpinnerProps) {
  return (
    <span
      className="rmw-spinner"
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        borderWidth: Math.max(2, Math.round(size / 8)),
        borderColor: color,
        borderRightColor: 'transparent',
      }}
    />
  );
}
