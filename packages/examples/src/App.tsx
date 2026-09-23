import { useState } from 'react';
import { ExampleSection } from './ExampleSection';
import {
  chatUsage,
  dataTableUsage,
  galleryUsage,
  profileCardUsage,
  statsWidgetsUsage,
} from './usageSnippets';
import profileCardSource from './examples/ProfileCardExample.tsx?raw';
import dataTableSource from './examples/DataTableExample.tsx?raw';
import chatSource from './examples/ChatExample.tsx?raw';
import gallerySource from './examples/GalleryExample.tsx?raw';
import statsWidgetsSource from './examples/StatsWidgetsExample.tsx?raw';

interface ExampleConfig {
  id: string;
  title: string;
  description: string;
  usageCode: string;
  sourceCode: string;
}

const examples: ExampleConfig[] = [
  {
    id: 'profile-card',
    title: 'Profile card',
    description: 'A rounded avatar next to stacked text — the classic card shape.',
    usageCode: profileCardUsage,
    sourceCode: profileCardSource,
  },
  {
    id: 'data-table',
    title: 'Data table',
    description: 'Rows and columns — a grid of short text cells at varying widths.',
    usageCode: dataTableUsage,
    sourceCode: dataTableSource,
  },
  {
    id: 'chat',
    title: 'Chat thread',
    description:
      'Bubbles of irregular width alternating left and right. One wrapper per message, each with its own cacheKey.',
    usageCode: chatUsage,
    sourceCode: chatSource,
  },
  {
    id: 'gallery',
    title: 'Image gallery',
    description: 'A grid of image tiles, each with a two-line caption.',
    usageCode: galleryUsage,
    sourceCode: gallerySource,
  },
  {
    id: 'stats',
    title: 'Dashboard stats',
    description:
      'A row of compact widgets. One wrapper per stat box, each with its own cacheKey.',
    usageCode: statsWidgetsUsage,
    sourceCode: statsWidgetsSource,
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
          Every example below is live: edit the code and watch the skeleton follow.
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
          usageCode={example.usageCode}
          sourceCode={example.sourceCode}
          loading={loadingById[example.id]}
          onLoadingChange={(loading) =>
            setLoadingById((prev) => ({ ...prev, [example.id]: loading }))
          }
        />
      ))}
    </main>
  );
}
