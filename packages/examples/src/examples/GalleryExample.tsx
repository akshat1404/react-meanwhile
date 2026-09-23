const photos = [
  { id: 1, title: 'Alpine lake', meta: 'Maya · 2.1k likes', hue: 200 },
  { id: 2, title: 'Desert road', meta: 'Jonas · 980 likes', hue: 30 },
  { id: 3, title: 'Old town', meta: 'Priya · 1.4k likes', hue: 340 },
  { id: 4, title: 'Pine forest', meta: 'Leo · 3.6k likes', hue: 140 },
  { id: 5, title: 'Night market', meta: 'Sana · 720 likes', hue: 275 },
  { id: 6, title: 'Coastline', meta: 'Tom · 1.9k likes', hue: 175 },
];

function gradientImage(hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="132" height="99"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 65%)"/><stop offset="1" stop-color="hsl(${hue + 40} 65% 40%)"/></linearGradient></defs><rect width="132" height="99" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function PhotoGrid() {
  return (
    <div className="gallery">
      {photos.map((photo) => (
        <figure key={photo.id} className="photo">
          <img src={gradientImage(photo.hue)} width={132} height={99} alt={photo.title} />
          <figcaption>
            <span className="photo-title">{photo.title}</span>
            <span className="photo-meta">{photo.meta}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function GalleryExample() {
  const loading = useLoading();

  return (
    <SkeletonWrapper loading={loading}>
      <PhotoGrid />
    </SkeletonWrapper>
  );
}

render(<GalleryExample />);
