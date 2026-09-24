import { afterEach, describe, expect, it, vi } from 'vitest';
import { measureContainer } from './measure';

interface RectInput {
  left: number;
  top: number;
  width: number;
  height: number;
}

function rect(input: RectInput): DOMRect {
  return {
    x: input.left,
    y: input.top,
    left: input.left,
    top: input.top,
    right: input.left + input.width,
    bottom: input.top + input.height,
    width: input.width,
    height: input.height,
    toJSON: () => input,
  };
}

function mockRects(map: Map<Element, RectInput>, containerRect: RectInput) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    const found = map.get(this);
    if (found) return rect(found);
    return rect(containerRect);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('measureContainer shape', () => {
  it('measures a text leaf relative to the container', () => {
    const container = document.createElement('div');
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Hello world';
    container.appendChild(paragraph);
    document.body.appendChild(container);

    const containerRect = { left: 10, top: 10, width: 200, height: 100 };
    mockRects(new Map([[paragraph, { left: 20, top: 20, width: 150, height: 20 }]]), containerRect);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: '20px',
      borderRadius: '0px',
    } as CSSStyleDeclaration);

    const shapes = measureContainer(container).shape;

    expect(shapes).toEqual([{ x: 10, y: 10, width: 150, height: 20, type: 'text' }]);
  });

  it('classifies a square element with 50% border-radius as a circle', () => {
    const container = document.createElement('div');
    const avatar = document.createElement('div');
    container.appendChild(avatar);
    document.body.appendChild(container);

    const containerRect = { left: 0, top: 0, width: 200, height: 200 };
    mockRects(new Map([[avatar, { left: 0, top: 0, width: 40, height: 40 }]]), containerRect);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: 'normal',
      borderRadius: '20px',
    } as CSSStyleDeclaration);

    const shapes = measureContainer(container).shape;

    expect(shapes).toEqual([{ x: 0, y: 0, width: 40, height: 40, type: 'circle' }]);
  });

  it('classifies a non-square or non-rounded element as a rect', () => {
    const container = document.createElement('div');
    const box = document.createElement('div');
    container.appendChild(box);
    document.body.appendChild(container);

    const containerRect = { left: 0, top: 0, width: 200, height: 200 };
    mockRects(new Map([[box, { left: 5, top: 5, width: 100, height: 30 }]]), containerRect);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: 'normal',
      borderRadius: '0px',
    } as CSSStyleDeclaration);

    const shapes = measureContainer(container).shape;

    expect(shapes).toEqual([{ x: 5, y: 5, width: 100, height: 30, type: 'rect' }]);
  });

  it('skips zero-size elements', () => {
    const container = document.createElement('div');
    const hidden = document.createElement('div');
    container.appendChild(hidden);
    document.body.appendChild(container);

    const containerRect = { left: 0, top: 0, width: 200, height: 200 };
    mockRects(new Map([[hidden, { left: 0, top: 0, width: 0, height: 0 }]]), containerRect);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: 'normal',
      borderRadius: '0px',
    } as CSSStyleDeclaration);

    const shapes = measureContainer(container).shape;

    expect(shapes).toEqual([]);
  });

  it('only measures leaf elements, not their ancestors', () => {
    const container = document.createElement('div');
    const wrapper = document.createElement('div');
    const label = document.createElement('span');
    label.textContent = 'Name';
    wrapper.appendChild(label);
    container.appendChild(wrapper);
    document.body.appendChild(container);

    const containerRect = { left: 0, top: 0, width: 200, height: 200 };
    mockRects(
      new Map([
        [wrapper, { left: 0, top: 0, width: 100, height: 20 }],
        [label, { left: 0, top: 0, width: 40, height: 20 }],
      ]),
      containerRect,
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: '20px',
      borderRadius: '0px',
    } as CSSStyleDeclaration);

    const shapes = measureContainer(container).shape;

    expect(shapes).toHaveLength(1);
    expect(shapes[0]).toMatchObject({ type: 'text', width: 40 });
  });
});

describe('measureContainer bounds', () => {
  it("reads the container's own bounding rect", () => {
    const container = document.createElement('div');
    const child = document.createElement('span');
    child.textContent = 'x';
    container.appendChild(child);
    document.body.appendChild(container);

    mockRects(new Map([[child, { left: 10, top: 10, width: 30, height: 20 }]]), {
      left: 0,
      top: 0,
      width: 240,
      height: 96,
    });

    expect(measureContainer(container).bounds).toEqual({ width: 240, height: 96 });
  });

  it('does not derive bounds from the leaf rects', () => {
    const container = document.createElement('div');
    const child = document.createElement('div');
    container.appendChild(child);
    document.body.appendChild(container);

    mockRects(new Map([[child, { left: 0, top: 0, width: 10, height: 10 }]]), {
      left: 0,
      top: 0,
      width: 300,
      height: 150,
    });

    const { bounds, shape } = measureContainer(container);

    expect(shape).toHaveLength(1);
    expect(bounds).toEqual({ width: 300, height: 150 });
  });

  it('reports the container bounds even when there are no leaves to draw', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    mockRects(new Map(), { left: 5, top: 5, width: 120, height: 40 });

    expect(measureContainer(container)).toEqual({
      shape: [],
      bounds: { width: 120, height: 40 },
    });
  });

  it('reports zero bounds under JSDOM-style zero layout', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    mockRects(new Map(), { left: 0, top: 0, width: 0, height: 0 });

    expect(measureContainer(container).bounds).toEqual({ width: 0, height: 0 });
  });
});
