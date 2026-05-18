export function generateChartColors(length: number) {
  return Array.from({ length }, (_, index) => {
    const hue = Math.round((index * 360) / Math.max(length, 1));
    return `hsl(${hue} 72% 48%)`;
  });
}
