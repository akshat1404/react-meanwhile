import type { ReactNode } from 'react';
import { SkeletonLoader } from './reveal/skeleton/SkeletonLoader';
import { SpinnerLoader } from './reveal/spinner/SpinnerLoader';

// More members join this union as reveal/progress loader types are implemented.
export type MeanwhileProps =
  | {
      type: 'skeleton';
      loading: boolean;
      children: ReactNode;
      cacheKey?: string;
    }
  | {
      type: 'spinner';
      loading: boolean;
      children: ReactNode;
      cacheKey?: string;
      size?: number;
      color?: string;
    };

export function Meanwhile(props: MeanwhileProps) {
  switch (props.type) {
    case 'skeleton':
      return (
        <SkeletonLoader loading={props.loading} cacheKey={props.cacheKey}>
          {props.children}
        </SkeletonLoader>
      );
    case 'spinner':
      return (
        <SpinnerLoader
          loading={props.loading}
          cacheKey={props.cacheKey}
          size={props.size}
          color={props.color}
        >
          {props.children}
        </SpinnerLoader>
      );
  }
}
