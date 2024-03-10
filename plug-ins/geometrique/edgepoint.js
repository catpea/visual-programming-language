export default function edgepoint(cx, cy, r, x1, y1, x2, y2) {
      // Calculate the direction angle in radians from point (x1, y1) to point (x2, y2)
      const angleRadians = Math.atan2(y2 - y1, x2 - x1);

      // Calculate the point on the circle edge using this direction angle
      const x = cx + r * Math.cos(angleRadians);
      const y = cy + r * Math.sin(angleRadians);
      return [x, y];
  }
