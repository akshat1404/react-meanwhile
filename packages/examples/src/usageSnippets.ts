export const profileCardUsage = `<Meanwhile type="skeleton" loading={loading}>
  <ProfileCard user={user} />
</Meanwhile>`;

export const dataTableUsage = `<Meanwhile type="skeleton" loading={loading}>
  <InvoiceTable rows={rows} />
</Meanwhile>`;

export const chatUsage = `{messages.map((message) => (
  <Meanwhile
    key={message.id}
    type="skeleton"
    loading={loading}
    cacheKey={\`chat-message-\${message.id}\`}
  >
    <ChatMessage message={message} />
  </Meanwhile>
))}`;

export const galleryUsage = `<Meanwhile type="skeleton" loading={loading}>
  <PhotoGrid photos={photos} />
</Meanwhile>`;

export const statsWidgetsUsage = `{stats.map((stat) => (
  <Meanwhile
    key={stat.id}
    type="skeleton"
    loading={loading}
    cacheKey={\`stat-\${stat.id}\`}
  >
    <StatBox stat={stat} />
  </Meanwhile>
))}`;
