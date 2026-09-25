import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HotspotZone, RescueProvider, TelemetryData } from '@/types/sos';
import { MOCK_HOTSPOTS } from '@/services/mockData';
import {
  Radar,
  MapPin,
  Satellite,
  Layers,
  Globe,
  Radio,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeafletRadarMapProps {
  userTelemetry: TelemetryData;
  activeProvider?: RescueProvider | null;
  selectedHotspot?: HotspotZone | null;
  onSelectHotspot?: (hotspot: HotspotZone | null) => void;
  className?: string;
  showRadarSweep?: boolean;
}

type MapLayerType = 'sentinel1' | 'viirs' | 'tactical';

export const LeafletRadarMap: React.FC<LeafletRadarMapProps> = ({
  userTelemetry,
  activeProvider,
  selectedHotspot,
  onSelectHotspot,
  className = 'h-[440px] md:h-[520px]',
  showRadarSweep = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const rescuerMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const hotspotLayersRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('sentinel1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'accidents' | 'ice' | 'depots'>('all');
  const [radarSweeping, setRadarSweeping] = useState<boolean>(showRadarSweep);

  // Layer URL mapping
  const getTileConfig = (type: MapLayerType) => {
    switch (type) {
      case 'sentinel1':
        // NASA GIBS Sentinel-1 Synthetic Aperture Radar (SAR) Normalized Backscatter Imagery
        return {
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Sentinel1A_B_C_D_SAR_GRD_Normalized_Radar_Backscatter/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png',
          options: {
            maxZoom: 16,
            minZoom: 1,
            attribution: 'NASA EOSDIS GIBS / ESA Sentinel-1 SAR Radar',
          },
        };
      case 'viirs':
        // NASA GIBS TrueColor Earth satellite imagery
        return {
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
          options: {
            maxZoom: 16,
            minZoom: 1,
            attribution: 'NASA EOSDIS GIBS / Suomi NPP VIIRS',
          },
        };
      case 'tactical':
      default:
        // High contrast Tactical Dark CartoDB
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
          options: {
            maxZoom: 19,
            subdomains: 'abcd',
            attribution: 'CartoDB Dark Tactical Radar',
          },
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const userLat = userTelemetry.latitude;
    const userLng = userTelemetry.longitude;

    const map = L.map(mapContainerRef.current, {
      center: [userLat, userLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Base layer (Sentinel-1 default)
    const initialConfig = getTileConfig('sentinel1');
    const baseTile = L.tileLayer(initialConfig.url, initialConfig.options).addTo(map);
    tileLayerRef.current = baseTile;

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;
    hotspotLayersRef.current = L.layerGroup().addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer switch
  const handleSwitchLayer = (layerType: MapLayerType) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setActiveLayer(layerType);

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = getTileConfig(layerType);
    const newTile = L.tileLayer(config.url, config.options).addTo(map);
    tileLayerRef.current = newTile;
    newTile.bringToBack();
  };

  // Update User Marker with Tactical Radar Beacon
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userLat = userTelemetry.latitude;
    const userLng = userTelemetry.longitude;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLat, userLng]);
    } else {
      const userIcon = L.divIcon({
        className: 'user-radar-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        html: `
          <div class="relative w-11 h-11 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-red-600/40 animate-ping"></div>
            <div class="absolute inset-1.5 rounded-full border-2 border-white bg-black flex items-center justify-center shadow-hard-sm">
              <div class="w-3.5 h-3.5 rounded-full bg-red-500 border border-white animate-pulse"></div>
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap bg-black text-white text-[10px] font-black px-1.5 py-0.5 border border-white tracking-widest uppercase">
              YOU (STRANDED)
            </div>
          </div>
        `,
      });

      userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-mono text-xs bg-black text-white border-2 border-white">
            <div class="font-black text-yellow-300 border-b border-neutral-700 pb-1 mb-1">STRANDED MOTORIST GPS</div>
            <div>Lat: ${userLat.toFixed(5)}</div>
            <div>Lng: ${userLng.toFixed(5)}</div>
            <div>Accuracy: ±${userTelemetry.accuracyMeters}m</div>
            <div class="text-[11px] font-bold text-red-400 mt-1">${userTelemetry.highwayMarker || 'Corridor Staging'}</div>
          </div>
        `);
    }
  }, [userTelemetry]);

  // Update Hotspot Zones Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = hotspotLayersRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const filtered = MOCK_HOTSPOTS.filter((h) => {
      if (activeFilter === 'accidents') return h.type === 'accident_cluster';
      if (activeFilter === 'ice') return h.type === 'icy_grade';
      if (activeFilter === 'depots') return h.type === 'patrol_depot';
      return true;
    });

    filtered.forEach((hotspot) => {
      let fillColor = '#FF3300';
      let strokeColor = '#000000';
      let iconBadge = '⚠️';

      if (hotspot.severity === 'safe_haven') {
        fillColor = '#10B981';
        iconBadge = '🛡️';
      } else if (hotspot.severity === 'medium' || hotspot.type === 'low_signal_deadzone') {
        fillColor = '#0066FF';
        iconBadge = '📶';
      } else if (hotspot.severity === 'caution') {
        fillColor = '#FFCC00';
        iconBadge = '⚡';
      }

      const circle = L.circle(hotspot.coordinates, {
        radius: hotspot.radiusMeters,
        color: strokeColor,
        weight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        dashArray: hotspot.severity === 'safe_haven' ? '4, 4' : undefined,
      }).addTo(layerGroup);

      const hotspotIcon = L.divIcon({
        className: 'hotspot-custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        html: `
          <div class="w-8 h-8 rounded-none border-2 border-white flex items-center justify-center font-bold text-xs shadow-hard-sm cursor-pointer transition-transform hover:scale-110"
               style="background-color: ${fillColor}; color: ${fillColor === '#FFCC00' ? '#000000' : '#ffffff'};">
            ${iconBadge}
          </div>
        `,
      });

      const marker = L.marker(hotspot.coordinates, { icon: hotspotIcon }).addTo(layerGroup);

      const popupContent = `
        <div style="font-family: monospace; max-width: 240px; padding: 4px; background: #000; color: #fff; border: 2px solid #fff;">
          <div style="background: #222; color: #ffcc00; padding: 4px 6px; font-weight: bold; font-size: 11px; text-transform: uppercase;">
            ${hotspot.name}
          </div>
          <div style="padding: 6px 0; font-size: 11px; line-height: 1.4; color: #eee;">
            <div><strong>Type:</strong> ${hotspot.type.replace('_', ' ').toUpperCase()}</div>
            <div><strong>Severity:</strong> <span style="color: ${fillColor}; font-weight: bold;">${hotspot.severity.toUpperCase()}</span></div>
            <div><strong>Incidents:</strong> ${hotspot.historicalIncidents}</div>
            <div style="margin-top: 4px; padding: 4px; background: #111; border-left: 3px solid ${fillColor}; font-size: 10px;">
              ${hotspot.recommendedPrecaution}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      circle.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectHotspot) onSelectHotspot(hotspot);
      });
    });
  }, [activeFilter, onSelectHotspot]);

  // Update Rescuer Marker & Trajectory Line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!activeProvider) {
      if (rescuerMarkerRef.current) {
        map.removeLayer(rescuerMarkerRef.current);
        rescuerMarkerRef.current = null;
      }
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
      return;
    }

    const rescuerPos = activeProvider.currentCoordinates;
    const userPos: [number, number] = [userTelemetry.latitude, userTelemetry.longitude];

    const rescuerIcon = L.divIcon({
      className: 'rescuer-radar-pin',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      html: `
        <div class="relative w-11 h-11 flex items-center justify-center">
          <div class="w-10 h-10 border-2 border-white bg-yellow-400 flex flex-col items-center justify-center shadow-hard font-mono text-[10px] font-black text-black">
            <span class="text-xs">🚜</span>
            <span class="leading-none text-[8px] tracking-tight">RESCUE</span>
          </div>
          <div class="absolute -top-5 whitespace-nowrap bg-black text-yellow-300 text-[9px] font-bold px-1 py-0.2 border border-white tracking-widest uppercase">
            ${activeProvider.currentEtaMinutes}M ETA
          </div>
        </div>
      `,
    });

    if (rescuerMarkerRef.current) {
      rescuerMarkerRef.current.setLatLng(rescuerPos);
    } else {
      rescuerMarkerRef.current = L.marker(rescuerPos, { icon: rescuerIcon, zIndexOffset: 990 })
        .addTo(map)
        .bindPopup(`
          <div class="font-mono text-xs p-1 bg-black text-white border-2 border-white">
            <div class="font-bold text-yellow-300 p-1">DISPATCHED: ${activeProvider.companyName}</div>
            <div class="mt-1"><strong>Driver:</strong> ${activeProvider.driverName}</div>
            <div><strong>Vehicle:</strong> ${activeProvider.vehicleType}</div>
            <div class="text-red-400 font-bold mt-1">Live ETA: ${activeProvider.currentEtaMinutes} mins</div>
          </div>
        `);
    }

    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs([rescuerPos, userPos]);
    } else {
      routeLineRef.current = L.polyline([rescuerPos, userPos], {
        color: '#FFCC00',
        weight: 4,
        dashArray: '8, 8',
      }).addTo(map);
    }

    const bounds = L.latLngBounds([userPos, rescuerPos]);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
  }, [activeProvider, userTelemetry]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([userTelemetry.latitude, userTelemetry.longitude], 13);
  };

  return (
    <div className={`relative w-full rounded-3xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden flex flex-col ${className}`}>
      {/* Top Map Toolbar: NASA Sentinel-1 SAR & Layer Switcher */}
      <div className="z-10 glass-panel px-4 py-2.5 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-tight text-white">
            SAR Live Radar
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-semibold px-2 py-0.5 rounded-full">
            All-Weather
          </span>
        </div>

        {/* Satellite Imagery Layer Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <Button
            size="sm"
            onClick={() => handleSwitchLayer('sentinel1')}
            className={`h-7 px-2.5 text-[11px] rounded-xl font-medium transition-all ${
              activeLayer === 'sentinel1'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Sentinel-1
          </Button>
          <Button
            size="sm"
            onClick={() => handleSwitchLayer('viirs')}
            className={`h-7 px-2.5 text-[11px] rounded-xl font-medium transition-all ${
              activeLayer === 'viirs'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            NASA Satellite
          </Button>
          <Button
            size="sm"
            onClick={() => handleSwitchLayer('tactical')}
            className={`h-7 px-2.5 text-[11px] rounded-xl font-medium transition-all ${
              activeLayer === 'tactical'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Dark Vector
          </Button>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative flex-1 w-full min-h-0 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Optical Radar Sweep Line */}
        {radarSweeping && (
          <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[180px] h-[180px] md:w-[260px] md:h-[260px] border border-emerald-500/20 rounded-full" />
              <div className="w-[320px] h-[320px] md:w-[460px] md:h-[460px] border border-dashed border-emerald-500/20 rounded-full" />
              <div className="w-[460px] h-[460px] md:w-[680px] md:h-[680px] border border-emerald-500/15 rounded-full" />
            </div>

            <div className="absolute top-1/2 left-1/2 w-[340px] md:w-[480px] h-[2px] bg-gradient-to-r from-emerald-400/80 to-transparent origin-left -translate-y-1/2 animate-[spin_8s_linear_infinite]" />
          </div>
        )}

        {/* Map Control Buttons */}
        <div className="absolute bottom-4 left-4 z-[500] flex flex-col gap-2">
          <Button
            size="sm"
            onClick={handleRecenter}
            className="h-8 px-3 glass-panel text-white rounded-xl shadow-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 border border-white/10"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Lock Coordinates</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setRadarSweeping(!radarSweeping)}
            className="h-8 px-3 glass-panel text-slate-300 rounded-xl shadow-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 border border-white/10"
          >
            <Radar className={`w-3.5 h-3.5 ${radarSweeping ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
            <span>{radarSweeping ? 'Sweep: ON' : 'Sweep: OFF'}</span>
          </Button>
        </div>

        {/* SAR Live Metadata Badge */}
        <div className="hidden sm:block absolute top-4 right-4 z-[500] glass-panel rounded-2xl text-white p-3 shadow-xl text-xs space-y-1 max-w-[210px] border border-white/10">
          <div className="font-bold border-b border-white/5 pb-1 flex items-center justify-between text-amber-300">
            <span>NASA SAR FEED</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">LIVE</span>
          </div>
          <div className="text-slate-400 text-[11px] leading-relaxed">
            Sentinel-1 synthetic aperture radar penetrates weather, fog, and night terrain across Kenya.
          </div>
        </div>
      </div>
    </div>
  );
};
