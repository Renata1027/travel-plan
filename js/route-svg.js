function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function perpendicularOffset(a, b, distance) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: (-dy / length) * distance, y: (dx / length) * distance };
}

export function buildRoutePathD(waypoints, { wiggle = 3 } = {}) {
  if (waypoints.length < 2) {
    return '';
  }
  let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
  for (let i = 1; i < waypoints.length; i += 1) {
    const start = waypoints[i - 1];
    const end = waypoints[i];
    const mid = midpoint(start, end);
    const direction = i % 2 === 0 ? 1 : -1;
    const offset = perpendicularOffset(start, end, wiggle * direction);
    const controlX = mid.x + offset.x;
    const controlY = mid.y + offset.y;
    d += ` Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${end.x} ${end.y}`;
  }
  return d;
}
