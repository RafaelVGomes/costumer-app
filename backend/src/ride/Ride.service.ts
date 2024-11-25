export function calculateRideEstimate (_startLocation: string, _endLocation: string): number {
  const distance = Math.random() * 50; // Simula uma distância
  const rate = 2; // Simula uma tarifa
  return distance * rate;
};
