export const profileCardUsage = `<SkeletonWrapper loading={loading}>
  <ProfileCard user={user} />
</SkeletonWrapper>`;

export const dataTableUsage = `<SkeletonWrapper loading={loading}>
  <InvoiceTable rows={rows} />
</SkeletonWrapper>`;

export const chatUsage = `{messages.map((message) => (
  <SkeletonWrapper
    key={message.id}
    loading={loading}
    cacheKey={\`chat-message-\${message.id}\`}
  >
    <ChatMessage message={message} />
  </SkeletonWrapper>
))}`;

export const galleryUsage = `<SkeletonWrapper loading={loading}>
  <PhotoGrid photos={photos} />
</SkeletonWrapper>`;

export const statsWidgetsUsage = `{stats.map((stat) => (
  <SkeletonWrapper
    key={stat.id}
    loading={loading}
    cacheKey={\`stat-\${stat.id}\`}
  >
    <StatBox stat={stat} />
  </SkeletonWrapper>
))}`;
