export function ResearchLoop() {
  return (
    <div className="research-loop" aria-label="SmaKTis project workflow animation">
      <div className="loop-screen">
        <div className="signal-line signal-line-one" />
        <div className="signal-line signal-line-two" />
        <div className="signal-line signal-line-three" />
        <div className="molecule molecule-one" />
        <div className="molecule molecule-two" />
        <div className="chart-bars">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="loop-notes">
        <span>Consultation</span>
        <span>Scope</span>
        <span>Delivery</span>
      </div>
    </div>
  );
}
