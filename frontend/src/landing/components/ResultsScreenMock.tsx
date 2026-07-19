const TABS = ['Overview', 'Docs', 'SDK', 'cURL', 'Hooks', 'Types', 'OpenAPI', 'Mock Server'];

const ROWS: { method: string; path: string; name: string; apiType: string; badgeClass: string; auth: string; authClass: string }[] = [
  {
    method: 'GET',
    path: '/users',
    name: 'ListUsers',
    apiType: 'REST',
    badgeClass: 'badge-rest',
    auth: 'none',
    authClass: 'badge-auth-none',
  },
  {
    method: 'POST',
    path: '/users',
    name: 'CreateUser',
    apiType: 'REST',
    badgeClass: 'badge-rest',
    auth: 'bearer',
    authClass: 'badge-auth-set',
  },
  {
    method: 'POST',
    path: '/webhooks/orders',
    name: 'OrderWebhook',
    apiType: 'WEBHOOK',
    badgeClass: 'badge-webhook',
    auth: 'none',
    authClass: 'badge-auth-none',
  },
];

export default function ResultsScreenMock() {
  return (
    <div className="lp-mock-results">
      <div className="lp-mock-results-header">
        <h4>Generated Artifacts</h4>
        <div className="lp-mock-results-actions">
          <button type="button" className="lp-mock-results-btn" tabIndex={-1} disabled>
            Download ZIP
          </button>
          <button type="button" className="lp-mock-results-btn" tabIndex={-1} disabled>
            Start Over
          </button>
        </div>
      </div>

      <p className="lp-mock-results-baseurl">
        Base URL: <code>https://api.example.com/v1</code>
      </p>

      <div className="lp-mock-results-tabs">
        {TABS.map((tab) => (
          <span
            key={tab}
            className={tab === 'Overview' ? 'lp-mock-results-tab lp-mock-results-tab-active' : 'lp-mock-results-tab'}
          >
            {tab}
          </span>
        ))}
      </div>

      <table className="overview-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Name</th>
            <th>API Type</th>
            <th>Auth</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={`${row.method}-${row.path}`}>
              <td>{row.method}</td>
              <td>{row.path}</td>
              <td>{row.name}</td>
              <td>
                <span className={`badge ${row.badgeClass}`}>{row.apiType}</span>
              </td>
              <td>
                <span className={`badge ${row.authClass}`}>{row.auth}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
