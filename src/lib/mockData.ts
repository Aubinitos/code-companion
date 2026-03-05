// Simulated sensor data for Track My Sun

export interface SensorReading {
  timestamp: string;
  productionVoltage: number;
  productionCurrent: number;
  consumptionVoltage: number;
  consumptionCurrent: number;
  co2: number;
  microparticles: number;
}

export interface SystemStatus {
  mode: 'flat' | 'tilted' | 'auto';
  panAngle: number;
  tiltAngle: number;
  batteryLevel: number;
  systemUptime: string;
  wifiConnected: boolean;
  lastAcquisition: string;
}

function randomInRange(min: number, max: number, decimals = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateCurrentReadings(): SensorReading {
  const now = new Date();
  return {
    timestamp: now.toISOString(),
    productionVoltage: randomInRange(11.5, 14.2),
    productionCurrent: randomInRange(0.8, 3.5),
    consumptionVoltage: randomInRange(11.8, 12.6),
    consumptionCurrent: randomInRange(0.3, 1.2),
    co2: randomInRange(350, 600, 0),
    microparticles: randomInRange(5, 80, 0),
  };
}

export function generateHistoricalData(hours: number = 24): SensorReading[] {
  const data: SensorReading[] = [];
  const now = new Date();
  
  for (let i = hours * 60; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000);
    const hour = timestamp.getHours();
    
    // Simulate solar production curve (peak at noon)
    const solarFactor = hour >= 6 && hour <= 20 
      ? Math.sin(((hour - 6) / 14) * Math.PI) 
      : 0;
    
    data.push({
      timestamp: timestamp.toISOString(),
      productionVoltage: Number((11 + solarFactor * 3.2 + Math.random() * 0.3).toFixed(2)),
      productionCurrent: Number((solarFactor * 3.2 + Math.random() * 0.2).toFixed(2)),
      consumptionVoltage: Number((11.8 + Math.random() * 0.8).toFixed(2)),
      consumptionCurrent: Number((0.3 + Math.random() * 0.9).toFixed(2)),
      co2: Math.round(380 + Math.random() * 180 + (hour >= 7 && hour <= 9 ? 100 : 0) + (hour >= 17 && hour <= 19 ? 80 : 0)),
      microparticles: Math.round(10 + Math.random() * 50 + (hour >= 7 && hour <= 9 ? 30 : 0)),
    });
  }
  
  // Sample every 15 min for chart readability
  return data.filter((_, i) => i % 15 === 0);
}

export function getSystemStatus(): SystemStatus {
  return {
    mode: 'auto',
    panAngle: randomInRange(0, 180, 0),
    tiltAngle: randomInRange(20, 65, 0),
    batteryLevel: randomInRange(45, 95, 0),
    systemUptime: '3j 14h 22min',
    wifiConnected: true,
    lastAcquisition: new Date().toLocaleTimeString('fr-FR'),
  };
}

export function getAirQualityLabel(co2: number): { label: string; color: string } {
  if (co2 < 400) return { label: 'Excellente', color: 'text-success' };
  if (co2 < 500) return { label: 'Bonne', color: 'text-success' };
  if (co2 < 600) return { label: 'Moyenne', color: 'text-warning' };
  return { label: 'Mauvaise', color: 'text-destructive' };
}
