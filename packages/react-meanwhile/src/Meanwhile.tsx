import type { ReactNode } from 'react';
import { SkeletonLoader } from './reveal/skeleton/SkeletonLoader';

// More members join this union as reveal/progress loader types are implemented.
export type MeanwhileProps = {
  type: 'skeleton';
  loading: boolean;
  children: ReactNode;
  cacheKey?: string;
};

export function Meanwhile(props: MeanwhileProps) {
  switch (props.type) {
    case 'skeleton':
      return (
        <SkeletonLoader loading={props.loading} cacheKey={props.cacheKey}>
          {props.children}
        </SkeletonLoader>
      );
  }
}
