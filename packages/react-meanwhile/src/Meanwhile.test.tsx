import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { Meanwhile } from './Meanwhile';
import { skeletonCache } from './reveal/skeleton/SkeletonLoader';
import { spinnerCache } from './reveal/spinner/SpinnerLoader';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

function toRect(box: Box): DOMRect {
  return {
    ...box,
    x: box.left,
    y: box.top,
    right: box.left + box.width,
    bottom: box.top + box.height,
    toJSON: () => box,
  };
}

// JSDOM does no layout. Elements with data-rect get that box; everything else
// (the wrapper container, non-leaf elements) gets a default 200x80 box.
function mockLayout() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    const raw = (this as HTMLElement).dataset?.rect;
    return toRect(raw ? JSON.parse(raw) : { left: 0, top: 0, width: 200, height: 80 });
  });
}

function mockZeroLayout() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() =>
    toRect({ left: 0, top: 0, width: 0, height: 0 }),
  );
}

function Card() {
  return (
    <div>
      <p data-rect={JSON.stringify({ left: 0, top: 0, width: 150, height: 20 })}>Title</p>
      <p data-rect={JSON.stringify({ left: 0, top: 30, width: 180, height: 20 })}>Body</p>
    </div>
  );
}

const shapes = (container: HTMLElement) => container.querySelectorAll('.rmw-shape');

afterEach(() => {
  vi.restoreAllMocks();
  skeletonCache.clear();
  spinnerCache.clear();
});

describe('<Meanwhile type="skeleton">', () => {
  it('renders children and no skeleton when not loading', () => {
    mockLayout();
    const { container } = render(
      <Meanwhile type="skeleton" loading={false} cacheKey="not-loading">
        <Card />
      </Meanwhile>,
    );

    expect(screen.getByText('Title')).toBeVisible();
    expect(shapes(container)).toHaveLength(0);
  });

  it('renders the measured shape while loading and keeps children mounted but hidden', () => {
    mockLayout();
    const { container } = render(
      <Meanwhile type="skeleton" loading cacheKey="measured">
        <Card />
      </Meanwhile>,
    );

    expect(container.querySelectorAll('.rmw-shape--text')).toHaveLength(2);
    expect(container.querySelector('.rmw-fallback')).toBeNull();
    expect(screen.getByText('Title').closest('[style*="visibility: hidden"]')).not.toBeNull();
  });

  it('reuses the cached shape while loading without needing to re-measure', () => {
    mockLayout();
    const first = render(
      <Meanwhile type="skeleton" loading={false} cacheKey="cached">
        <Card />
      </Meanwhile>,
    );
    first.unmount();

    vi.restoreAllMocks();
    mockZeroLayout();
    const { container } = render(
      <Meanwhile type="skeleton" loading cacheKey="cached">
        <Card />
      </Meanwhile>,
    );

    expect(container.querySelectorAll('.rmw-shape--text')).toHaveLength(2);
    expect(container.querySelector('.rmw-fallback')).toBeNull();
  });

  it('falls back to a generic skeleton when nothing has been measured yet', () => {
    mockZeroLayout();
    const { container } = render(
      <Meanwhile type="skeleton" loading cacheKey="fallback">
        <Card />
      </Meanwhile>,
    );

    expect(container.querySelectorAll('.rmw-fallback .rmw-shape')).toHaveLength(3);
  });

  it('mounts children once regardless of how often loading toggles', () => {
    mockLayout();
    const onMount = vi.fn();
    function Probe() {
      useEffect(() => {
        onMount();
      }, []);
      return <p>probe</p>;
    }

    const { rerender } = render(
      <Meanwhile type="skeleton" loading cacheKey="probe">
        <Probe />
      </Meanwhile>,
    );
    for (const loading of [false, true, false, true]) {
      rerender(
        <Meanwhile type="skeleton" loading={loading} cacheKey="probe">
          <Probe />
        </Meanwhile>,
      );
    }

    expect(onMount).toHaveBeenCalledTimes(1);
  });
});

const placeholder = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('.rmw-spinner-box');

describe('<Meanwhile type="spinner">', () => {
  it('renders children and no spinner when not loading', () => {
    mockLayout();
    const { container } = render(
      <Meanwhile type="spinner" loading={false} cacheKey="spinner-idle">
        <Card />
      </Meanwhile>,
    );

    expect(screen.getByText('Title')).toBeVisible();
    expect(placeholder(container)).toBeNull();
    expect(container.querySelector('.rmw-spinner')).toBeNull();
  });

  it('renders a placeholder matching the measured bounds, with the spinner inside, while loading', () => {
    mockLayout();
    const { container } = render(
      <Meanwhile type="spinner" loading cacheKey="spinner-measured">
        <Card />
      </Meanwhile>,
    );

    const box = placeholder(container);
    expect(box).not.toBeNull();
    expect(box!.style.width).toBe('200px');
    expect(box!.style.height).toBe('80px');
    expect(box!.querySelector('.rmw-spinner')).not.toBeNull();
    expect(screen.getByText('Title').closest('[style*="visibility: hidden"]')).not.toBeNull();
  });

  it('reuses the last measured bounds while loading without re-measuring', () => {
    mockLayout();
    render(
      <Meanwhile type="spinner" loading={false} cacheKey="spinner-cached">
        <Card />
      </Meanwhile>,
    ).unmount();

    vi.restoreAllMocks();
    mockZeroLayout();
    const { container } = render(
      <Meanwhile type="spinner" loading cacheKey="spinner-cached">
        <Card />
      </Meanwhile>,
    );

    const box = placeholder(container);
    expect(box!.style.width).toBe('200px');
    expect(box!.style.height).toBe('80px');
  });

  it('falls back to a 120x40 box on a first-ever loading render with nothing cached', () => {
    mockZeroLayout();
    const { container } = render(
      <Meanwhile type="spinner" loading cacheKey="spinner-first">
        <Card />
      </Meanwhile>,
    );

    const box = placeholder(container);
    expect(box!.style.width).toBe('120px');
    expect(box!.style.height).toBe('40px');
    expect(box!.querySelector('.rmw-spinner')).not.toBeNull();
  });

  it('keeps its cache separate from the skeleton loader for the same cacheKey', () => {
    mockLayout();
    render(
      <Meanwhile type="skeleton" loading={false} cacheKey="shared-key">
        <Card />
      </Meanwhile>,
    ).unmount();

    vi.restoreAllMocks();
    mockZeroLayout();
    const { container } = render(
      <Meanwhile type="spinner" loading cacheKey="shared-key">
        <Card />
      </Meanwhile>,
    );

    expect(placeholder(container)!.style.width).toBe('120px');
  });

  it('passes size and color through to the spinner', () => {
    mockLayout();
    const { container } = render(
      <Meanwhile type="spinner" loading size={40} color="rgb(255, 0, 0)" cacheKey="spinner-props">
        <Card />
      </Meanwhile>,
    );

    const ring = container.querySelector<HTMLElement>('.rmw-spinner')!;
    expect(ring.style.width).toBe('40px');
    expect(ring.style.height).toBe('40px');
    expect(ring.style.borderColor).not.toBe('');
  });

  it('mounts children once regardless of how often loading toggles', () => {
    mockLayout();
    const onMount = vi.fn();
    function Probe() {
      useEffect(() => {
        onMount();
      }, []);
      return <p>probe</p>;
    }

    const { rerender } = render(
      <Meanwhile type="spinner" loading cacheKey="spinner-probe">
        <Probe />
      </Meanwhile>,
    );
    for (const loading of [false, true, false, true]) {
      rerender(
        <Meanwhile type="spinner" loading={loading} cacheKey="spinner-probe">
          <Probe />
        </Meanwhile>,
      );
    }

    expect(onMount).toHaveBeenCalledTimes(1);
  });
});
