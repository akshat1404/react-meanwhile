import React, { createContext, useContext, useEffect, useState } from 'react';
import { Meanwhile, type MeanwhileProps } from 'react-meanwhile';
import { themes } from 'prism-react-renderer';

interface PreviewState {
  loading: boolean;
  codeHash: string;
}

export const PreviewContext = createContext<PreviewState>({ loading: false, codeHash: '' });

/** Mirrors the section's loading toggle without re-evaluating the live code. */
export function useLoading(): boolean {
  return useContext(PreviewContext).loading;
}

/**
 * The real Meanwhile, with the current code's hash folded into its
 * cacheKey. Editing the code changes the hash, so a skeleton measured from
 * an earlier version of the code is never reused for the edited one.
 */
export function LiveMeanwhile({ cacheKey, ...props }: MeanwhileProps) {
  const { codeHash } = useContext(PreviewContext);
  return <Meanwhile {...props} cacheKey={`live-${codeHash}:${cacheKey ?? 'default'}`} />;
}

// Must stay referentially stable: react-live re-evaluates (and remounts) the
// preview whenever `scope` changes identity.
export const liveScope = {
  React,
  Meanwhile: LiveMeanwhile,
  useLoading,
};

export function hashCode(source: string): string {
  let hash = 5381;
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5) + hash + source.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

const transparent = (theme: typeof themes.github) => ({
  ...theme,
  plain: { ...theme.plain, backgroundColor: 'transparent' },
});

const lightTheme = transparent(themes.github);
const darkTheme = transparent(themes.vsDark);

export function useEditorTheme() {
  const [dark, setDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return dark ? darkTheme : lightTheme;
}
