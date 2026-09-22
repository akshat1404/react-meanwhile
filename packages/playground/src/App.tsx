import { useState } from 'react';
import { SkeletonWrapper } from 'react-meanwhile';
import { ProfileCard } from './fixtures/ProfileCard';
import { TableFixture } from './fixtures/TableFixture';
import { FormFixture } from './fixtures/FormFixture';
import { VariableHeightList } from './fixtures/VariableHeightList';
import { TagList } from './fixtures/TagList';

const sectionStyle = { marginBottom: 32 };

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h1>react-meanwhile playground</h1>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        <input
          type="checkbox"
          checked={loading}
          onChange={(e) => setLoading(e.target.checked)}
        />
        loading
      </label>

      <div style={sectionStyle}>
        <h2>Profile card (render counter)</h2>
        <SkeletonWrapper loading={loading}>
          <ProfileCard />
        </SkeletonWrapper>
      </div>

      <div style={sectionStyle}>
        <h2>Table</h2>
        <SkeletonWrapper loading={loading}>
          <TableFixture />
        </SkeletonWrapper>
      </div>

      <div style={sectionStyle}>
        <h2>Form</h2>
        <SkeletonWrapper loading={loading}>
          <FormFixture />
        </SkeletonWrapper>
      </div>

      <div style={sectionStyle}>
        <h2>Variable-height list</h2>
        <SkeletonWrapper loading={loading}>
          <VariableHeightList />
        </SkeletonWrapper>
      </div>

      <div style={sectionStyle}>
        <h2>Mapped/conditional tags</h2>
        <SkeletonWrapper loading={loading}>
          <TagList />
        </SkeletonWrapper>
      </div>
    </div>
  );
}
