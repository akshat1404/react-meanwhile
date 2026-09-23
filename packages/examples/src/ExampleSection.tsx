import type { ReactNode } from 'react';

interface ExampleSectionProps {
  title: string;
  description: string;
  code: string;
  loading: boolean;
  onLoadingChange: (loading: boolean) => void;
  children: ReactNode;
}

export function ExampleSection({
  title,
  description,
  code,
  loading,
  onLoadingChange,
  children,
}: ExampleSectionProps) {
  return (
    <section className="example">
      <header className="example-header">
        <div>
          <h2>{title}</h2>
          <p className="muted">{description}</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={loading}
            onChange={(e) => onLoadingChange(e.target.checked)}
          />
          <span>loading</span>
        </label>
      </header>
      <div className="stage">{children}</div>
      <pre className="code">
        <code>{code}</code>
      </pre>
    </section>
  );
}
