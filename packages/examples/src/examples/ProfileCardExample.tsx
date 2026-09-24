function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="avatar" />
      <div className="profile-text">
        <h3>Ada Lovelace</h3>
        <p className="title">Mathematician &amp; first programmer</p>
        <p className="bio">
          Wrote the first algorithm intended for a machine, for Charles
          Babbage&apos;s Analytical Engine, and saw that computers could go
          beyond arithmetic.
        </p>
      </div>
    </div>
  );
}

function ProfileCardExample() {
  const loading = useLoading();

  return (
    <Meanwhile type="skeleton" loading={loading}>
      <ProfileCard />
    </Meanwhile>
  );
}

render(<ProfileCardExample />);
