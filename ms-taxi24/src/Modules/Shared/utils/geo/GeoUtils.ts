export class GeoUtils {
  private static readonly EARTH_RADIUS_KM = 6371; // Radio de la Tierra en kilómetros

  /**
   * Calcula la distancia en kilómetros entre dos puntos usando la fórmula de Haversine
   * @param lat1 Latitud del primer punto en grados
   * @param lon1 Longitud del primer punto en grados
   * @param lat2 Latitud del segundo punto en grados
   * @param lon2 Longitud del segundo punto en grados
   * @returns Distancia en kilómetros
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Convertir grados a radianes
    const lat1Rad = this.toRadians(lat1);
    const lon1Rad = this.toRadians(lon1);
    const lat2Rad = this.toRadians(lat2);
    const lon2Rad = this.toRadians(lon2);

    // Diferencia de coordenadas
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Fórmula de Haversine
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = this.EARTH_RADIUS_KM * c;

    return Number(distance.toFixed(2)); // Redondear a 2 decimales
  }

  /**
   * Convierte grados a radianes
   * @param degrees Ángulo en grados
   * @returns Ángulo en radianes
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calcula el tiempo estimado de llegada en minutos
   * @param distanceKm Distancia en kilómetros
   * @param averageSpeedKmh Velocidad promedio en km/h (por defecto 30 km/h)
   * @returns Tiempo estimado en minutos
   */
  static calculateETA(distanceKm: number, averageSpeedKmh: number = 30): number {
    const timeInHours = distanceKm / averageSpeedKmh;
    return Number((timeInHours * 60).toFixed(0)); // Convertir a minutos y redondear
  }
} 