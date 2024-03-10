export default function midpoint({x1, y1, x2, y2}){
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  return {cx, cy};
}
