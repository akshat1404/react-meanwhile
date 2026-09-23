import type { ReactNode } from 'react';

interface ExampleSectionProps {
  title: string;
  description: string;
  code: string;
  sourceCode: string;
  loading: boolean;
  onLoadingChange: (loading: boolean) => void;
  children: ReactNode;
}

export function ExampleSection({
  title,
  description,
  code,
  sourceCode,
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
      <div className="code-panel">
        <p className="code-label">Usage</p>
        <pre className="code">
          <code>{code}</code>
        </pre>
      </div>
      <details className="code-panel" open>
        <summary className="code-label">Component source</summary>
        <pre className="code code--source">
          <code>{sourceCode}</code>
        </pre>
      </details>
    </section>
  );
}
