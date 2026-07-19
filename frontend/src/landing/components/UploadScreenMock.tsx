export default function UploadScreenMock() {
  return (
    <div className="lp-mock-upload">
      <h3 className="lp-mock-title">Smart API Builder</h3>
      <p className="lp-mock-sub">
        Upload a Postman Collection (v2.1 JSON) to generate docs, SDK, hooks, types, OpenAPI spec, and a mock server.
      </p>
      <div className="lp-mock-input">Base URL (optional — auto-detected if blank)</div>
      <div className="lp-mock-dropzone">
        <span>Click or drag a collection.json file here</span>
      </div>
    </div>
  );
}
