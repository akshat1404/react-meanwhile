const rows = [
  { id: 'INV-1042', customer: 'Northwind Traders', status: 'Paid', amount: '$2,400.00' },
  { id: 'INV-1043', customer: 'Acme Corp', status: 'Pending', amount: '$980.50' },
  { id: 'INV-1044', customer: 'Globex', status: 'Overdue', amount: '$12,310.00' },
  { id: 'INV-1045', customer: 'Initech', status: 'Paid', amount: '$450.00' },
  { id: 'INV-1046', customer: 'Umbrella Ltd', status: 'Pending', amount: '$7,205.75' },
];

function InvoiceTable() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>
            <span>Invoice</span>
          </th>
          <th>
            <span>Customer</span>
          </th>
          <th>
            <span>Status</span>
          </th>
          <th className="num">
            <span>Amount</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              <span>{row.id}</span>
            </td>
            <td>
              <span>{row.customer}</span>
            </td>
            <td>
              <span className={`status status--${row.status.toLowerCase()}`}>{row.status}</span>
            </td>
            <td className="num">
              <span>{row.amount}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DataTableExample() {
  const loading = useLoading();

  return (
    <SkeletonWrapper loading={loading}>
      <InvoiceTable />
    </SkeletonWrapper>
  );
}

render(<DataTableExample />);
