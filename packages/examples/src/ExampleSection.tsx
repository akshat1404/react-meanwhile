import { useMemo, useState } from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import { PreviewContext, hashCode, liveScope, useEditorTheme } from './live';

interface ExampleSectionProps {
  title: string;
  description: string;
  usageCode: string;
  sourceCode: string;
  loading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export function ExampleSection({
  title,
  description,
  usageCode,
  sourceCode,
  loading,
  onLoadingChange,
}: ExampleSectionProps) {
  const [code, setCode] = useState(sourceCode);
  const theme = useEditorTheme();

  const codeHash = useMemo(() => hashCode(code), [code]);
  const previewState = useMemo(() => ({ loading, codeHash }), [loading, codeHash]);

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

      <LiveProvider code={code} scope={liveScope} theme={theme} noInline>
        <div className="live-grid">
          <div className="live-pane">
            <p className="code-label">Preview</p>
            <div className="stage">
              <PreviewContext.Provider value={previewState}>
                <LivePreview />
              </PreviewContext.Provider>
            </div>
          </div>

          <div className="live-pane live-pane--editor">
            <div className="live-editor-header">
              <p className="code-label">Live editor</p>
              <button
                type="button"
                className="button button--small"
                onClick={() => setCode(sourceCode)}
                disabled={code === sourceCode}
              >
                Reset to original
              </button>
            </div>
            <div className="live-editor">
              <LiveEditor
                onChange={setCode}
                style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', lineHeight: 1.6 }}
              />
            </div>
            <LiveError className="live-error" />
          </div>
        </div>
      </LiveProvider>

      <div className="code-panel">
        <p className="code-label">Usage</p>
        <pre className="code">
          <code>{usageCode}</code>
        </pre>
      </div>
    </section>
  );
}
