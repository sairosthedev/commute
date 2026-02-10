type Point = { lat: number; lng: number };

type Geofence = {
  lat: number;
  lng: number;
  radiusMeters: number;
};

const toRad = (value: number): number => (value * Math.PI) / 180;

export const distanceMeters = (a: Point, b: Point): number => {
  const r = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * r * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const getZone = (
  point: Point,
  home?: Geofence | null,
  school?: Geofence | null
): "home" | "school" | "outside" => {
  if (home) {
    const homeDistance = distanceMeters(point, { lat: home.lat, lng: home.lng });
    if (homeDistance <= home.radiusMeters) {
      return "home";
    }
  }

  if (school) {
    const schoolDistance = distanceMeters(point, { lat: school.lat, lng: school.lng });
    if (schoolDistance <= school.radiusMeters) {
      return "school";
    }
  }

  return "outside";
};
