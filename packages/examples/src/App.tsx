import { useState, type ReactNode } from 'react';
import { ExampleSection } from './ExampleSection';
import { ProfileCardExample, profileCardCode } from './examples/ProfileCardExample';
import { DataTableExample, dataTableCode } from './examples/DataTableExample';
import { ChatExample, chatCode } from './examples/ChatExample';
import { GalleryExample, galleryCode } from './examples/GalleryExample';
import { StatsWidgetsExample, statsWidgetsCode } from './examples/StatsWidgetsExample';

interface ExampleConfig {
  id: string;
  title: string;
  description: string;
  code: string;
  render: (loading: boolean) => ReactNode;
}

const examples: ExampleConfig[] = [
  {
    id: 'profile-card',
    title: 'Profile card',
    description: 'A rounded avatar next to stacked text — the classic card shape.',
    code: profileCardCode,
    render: (loading) => <ProfileCardExample loading={loading} />,
  },
  {
    id: 'data-table',
    title: 'Data table',
    description: 'Rows and columns — a grid of short text cells at varying widths.',
    code: dataTableCode,
    render: (loading) => <DataTableExample loading={loading} />,
  },
  {
    id: 'chat',
    title: 'Chat thread',
    description:
      'Bubbles of irregular width alternating left and right. One wrapper per message, each with its own cacheKey.',
    code: chatCode,
    render: (loading) => <ChatExample loading={loading} />,
  },
  {
    id: 'gallery',
    title: 'Image gallery',
    description: 'A grid of image tiles, each with a two-line caption.',
    code: galleryCode,
    render: (loading) => <GalleryExample loading={loading} />,
  },
  {
    id: 'stats',
    title: 'Dashboard stats',
    description:
      'A row of compact widgets. One wrapper per stat box, each with its own cacheKey.',
    code: statsWidgetsCode,
    render: (loading) => <StatsWidgetsExample loading={loading} />,
  },
];

export default function App() {
  const [loadingById, setLoadingById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(examples.map((example) => [example.id, true])),
  );

  const allLoading = examples.every((example) => loadingById[example.id]);

  const setAll = (loading: boolean) =>
    setLoadingById(Object.fromEntries(examples.map((example) => [example.id, loading])));

  return (
    <main className="page">
      <header className="hero">
        <h1>react-meanwhile</h1>
        <p className="muted">
          Wrap any component in <code>SkeletonWrapper</code>. It measures the real
          rendered layout and shows a matching shimmer skeleton while{' '}
          <code>loading</code> is true — no skeleton markup to write or keep in sync.
        </p>
        <div className="hero-actions">
          <button type="button" className="button" onClick={() => setAll(!allLoading)}>
            {allLoading ? 'Show all loaded' : 'Show all loading'}
          </button>
          <a href="https://github.com/akshat1404/react-meanwhile">GitHub</a>
        </div>
      </header>

      {examples.map((example) => (
        <ExampleSection
          key={example.id}
          title={example.title}
          description={example.description}
          code={example.code}
          loading={loadingById[example.id]}
          onLoadingChange={(loading) =>
            setLoadingById((prev) => ({ ...prev, [example.id]: loading }))
          }
        >
          {example.render(loadingById[example.id])}
        </ExampleSection>
      ))}
    </main>
  );
}
