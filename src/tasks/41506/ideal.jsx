import React, { useState, useEffect } from "react";

function extractStats(text) {
  const numberPattern = /in\s(\d{4}).*?by\s(\d+)%/gi;
  const matches = [...text.matchAll(numberPattern)];
  const numbers = matches.map((match) => ({
    year: parseInt(match[1]),
    percentage: parseInt(match[2]),
  }));

  const locationPattern = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/g;
  const allLocations = text.match(locationPattern) || [];
  const locations = allLocations.filter((loc) => worldMapCoordinates[loc]);

  const keywordPattern = /\b[A-Za-z]{5,}\b/g;
  const keywords = [...new Set(text.match(keywordPattern) || [])].slice(0, 5);

  return {
    numbers,
    locations,
    keywords,
  };
}
const worldMapCoordinates = {
  "United States": { lat: 37.7749, lon: -122.4194 }, // San Francisco, USA
  "India": { lat: 28.6139, lon: 77.209 }, // Delhi, India
  "Germany": { lat: 52.5200, lon: 13.405 }, // Berlin, Germany
  "France": { lat: 48.8566, lon: 2.3522 }, // Paris, France
  "Canada": { lat: 56.1304, lon: -106.3468 }, // Canada (Central)
};
function latLonToSvg(lat, lon, width, height) {
  const x = ((lon + 180) / 360) * width; // Longitude to x
  const y =
    ((1 - Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI) / 360)) / Math.PI) /
      2) *
    height; // Latitude to y
  return { x: Math.round(x), y: Math.round(y) };
}


const BarChart = ({ data, title }) => (
  <div style={{ flex: 1, padding: "16px" }}>
    <h3 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px" }}>
      {title}
    </h3>
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        height: "200px",
        alignItems: "flex-end",
      }}
    >
      {data.map((entry, index) => (
        <div key={index} style={{ textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#1E90FF",
              height: `${entry.percentage * 2}px`,
              width: "20px",
              margin: "auto",
            }}
          ></div>
          <div style={{ marginTop: "8px", fontSize: "12px" }}>{entry.year}</div>
          <div style={{ fontSize: "10px", color: "gray" }}>{entry.percentage}%</div>
        </div>
      ))}
    </div>
  </div>
);

const PieChart = ({ data, title }) => (
  <div style={{ flex: 1, padding: "16px" }}>
    <h3 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "16px" }}>
      {title}
    </h3>
    <svg viewBox="0 0 32 32" style={{ width: "100%", height: "200px" }}>
      {data.reduce(
        (acc, keyword, i) => {
          const startAngle = acc.startAngle;
          const endAngle = startAngle + (360 / data.length);
          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
          const x1 = 16 + 16 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 16 - 16 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 16 + 16 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 16 - 16 * Math.sin((Math.PI * endAngle) / 180);
          return {
            paths: [
              ...acc.paths,
              <path
                key={i}
                d={`M16,16 L${x1},${y1} A16,16 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                fill={`hsl(${i * 72}, 70%, 50%)`}
              />,
              <text
                key={`label-${i}`}
                x={16 + 10 * Math.cos((Math.PI * (startAngle + endAngle)) / 360)}
                y={16 - 10 * Math.sin((Math.PI * (startAngle + endAngle)) / 360)}
                fontSize="1.5"
                fill="black"
                textAnchor="middle"
              >
                {keyword}
              </text>,
            ],
            startAngle: endAngle,
          };
        },
        { paths: [], startAngle: 0 }
      ).paths}
    </svg>
  </div>
);

const Map = ({ locations, onClickLocation }) => {
  const mapWidth = 1000;
  const mapHeight = 500;

  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        style={{ width: "100%", height: "100%" }}
      >
        <image
          href="https://upload.wikimedia.org/wikipedia/commons/4/41/Simple_world_map.svg"
          x="0"
          y="0"
          width={mapWidth}
          height={mapHeight}
        />
        {locations.map((loc, idx) => {
          const coords = worldMapCoordinates[loc];
          if (!coords) return null;
          const { x, y } = latLonToSvg(
            coords.lat,
            coords.lon,
            mapWidth,
            mapHeight
          );
          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r={8}
                fill="red"
                onClick={() => onClickLocation(loc)}
                style={{ cursor: "pointer" }}
              />
              <text
                x={x + 10}
                y={y}
                fontSize="12"
                fill="black"
                textAnchor="start"
              >
                {loc}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function App() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({ numbers: [], locations: [], keywords: [] });
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    setStats(extractStats(text));
  }, [text]);

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "16px" }}>
      <textarea
        placeholder="Paste your article here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          padding: "8px",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      />
      <button
        onClick={() => setText("")}
        style={{
          marginBottom: "16px",
          padding: "8px 16px",
          backgroundColor: "#1E90FF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Clear
      </button>
      {stats.numbers.length > 0 || stats.locations.length > 0 || stats.keywords.length > 0 ? (
        <div>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <BarChart data={stats.numbers} title="Numbers in Context" />
            <PieChart data={stats.keywords} title="Key Topics" />
          </div>
          <Map
            locations={stats.locations}
            onClickLocation={(loc) => setSelectedLocation(loc)}
          />
          {selectedLocation && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                Details about: {selectedLocation}
              </p>
              <p>Extracted details related to this location go here.</p>
            </div>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          No data extracted from the article. Try another input.
        </p>
      )}
    </div>
  );
}
