import React from 'react';

const TimeSeriesPreview = () => {
  const dataPoints = [
    { x: 10, y: 80 }, { x: 20, y: 75 }, { x: 30, y: 70 }, { x: 40, y: 65 },
    { x: 50, y: 60 }, { x: 60, y: 55 }, { x: 70, y: 50 }, { x: 80, y: 45 },
    { x: 90, y: 40 }, { x: 100, y: 35 }, { x: 110, y: 30 }, { x: 120, y: 25 },
    { x: 130, y: 20 }, { x: 140, y: 25 }, { x: 150, y: 30 }, { x: 160, y: 35 },
    { x: 170, y: 40 }, { x: 180, y: 45 }, { x: 190, y: 50 },
  ];

  const pointsString = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="time-series-chart">
      <div className="chart-title">SPB · trap⁻¹ · 14 days⁻¹</div>
      <div className="chart-area">
        <svg className="line-chart" viewBox="0 0 200 120">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="200" height="120" fill="url(#grid)" />
          <polyline
            fill="none"
            stroke="#1A4D2E"
            strokeWidth="2.5"
            points={pointsString}
          />

          {dataPoints.map((point) => (
            <circle
              key={`${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill="#1A4D2E"
            />
          ))}
          <line x1="10" y1="100" x2="190" y2="100" stroke="#333" strokeWidth="1" />
          <line x1="10" y1="10" x2="10" y2="100" stroke="#333" strokeWidth="1" />
          <text x="100" y="115" textAnchor="middle" fontSize="8" fill="#666">Year</text>
          <text x="5" y="55" textAnchor="middle" fontSize="8" fill="#666" transform="rotate(-90 5 55)">
            Average count
          </text>
        </svg>
      </div>
    </div>
  );
};

export default TimeSeriesPreview;
