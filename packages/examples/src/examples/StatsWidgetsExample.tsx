interface Stat {
  id: string;
  label: string;
  value: string;
  delta: string;
  hue: number;
}

const stats: Stat[] = [
  { id: 'revenue', label: 'Revenue', value: '$48.2k', delta: '+12.4% vs last week', hue: 150 },
  { id: 'users', label: 'Active users', value: '3,921', delta: '+3.1% vs last week', hue: 215 },
  { id: 'churn', label: 'Churn', value: '1.8%', delta: '-0.4% vs last week', hue: 25 },
  { id: 'nps', label: 'NPS', value: '62', delta: '+5 vs last week', hue: 280 },
];

function StatBox({ stat }: { stat: Stat }) {
  return (
    <div className="stat">
      <div
        className="stat-icon"
        style={{ background: `hsl(${stat.hue} 65% 55%)` }}
      />
      <span className="stat-label">{stat.label}</span>
      <span className="stat-value">{stat.value}</span>
      <span className="stat-delta">{stat.delta}</span>
    </div>
  );
}

function StatsWidgetsExample() {
  const loading = useLoading();

  return (
    <div className="stats">
      {stats.map((stat) => (
        <Meanwhile
          key={stat.id}
          type="skeleton"
          loading={loading}
          cacheKey={`stat-${stat.id}`}
        >
          <StatBox stat={stat} />
        </Meanwhile>
      ))}
    </div>
  );
}

render(<StatsWidgetsExample />);
