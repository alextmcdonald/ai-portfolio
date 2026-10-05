import React from 'react';

export interface EnvironmentItem {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  theme: 'light' | 'dark';
}

export const DARK_ENVIRONMENTS: EnvironmentItem[] = [
  {
    id: 'cupertino-studio',
    name: 'Cupertino Studio',
    subtitle: 'Architectural dusk interior',
    url: '/src/assets/images/env_apple_studio_1790732856805.jpg',
    theme: 'dark'
  },
  {
    id: 'dark-observatory',
    name: 'Dark Observatory',
    subtitle: 'Midnight stars & smoked titanium',
    url: '/src/assets/images/env_dark_observatory_1790741206337.jpg',
    theme: 'dark'
  },
  {
    id: 'alpine-twilight',
    name: 'Alpine Lake',
    subtitle: 'Mount Whitney twilight reflection',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop',
    theme: 'dark'
  },
  {
    id: 'dark-penthouse',
    name: 'Pacific Penthouse',
    subtitle: 'Architectural city nightscape',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    theme: 'dark'
  }
];

export const LIGHT_ENVIRONMENTS: EnvironmentItem[] = [
  {
    id: 'apple-park-daylight',
    name: 'Apple Park Daylight',
    subtitle: 'Sun-drenched minimalist studio',
    url: '/src/assets/images/env_apple_daylight_1790734169052.jpg',
    theme: 'light'
  },
  {
    id: 'nordic-studio',
    name: 'Scandinavian Studio',
    subtitle: 'Clean oak, glass & morning sun',
    url: '/src/assets/images/env_light_scandi_1790741166705.jpg',
    theme: 'light'
  },
  {
    id: 'coastal-pavilion',
    name: 'Pacific Coastline',
    subtitle: 'Travertine deck & turquoise ocean',
    url: '/src/assets/images/env_light_coast_1790741180007.jpg',
    theme: 'light'
  },
  {
    id: 'zen-garden',
    name: 'Glass Solarium',
    subtitle: 'Morning bamboo & tranquil pebbles',
    url: '/src/assets/images/env_light_garden_1790741193271.jpg',
    theme: 'light'
  }
];

export const ALL_ENVIRONMENTS: EnvironmentItem[] = [
  ...DARK_ENVIRONMENTS,
  ...LIGHT_ENVIRONMENTS
];

// Backward-compatible alias
export const ENVIRONMENTS = ALL_ENVIRONMENTS;

export interface EnvironmentProps {
  currentEnv: string;
  dimLevel: number;
  blurAmount: number;
  isLightMode: boolean;
}

export const Environment: React.FC<EnvironmentProps> = ({
  currentEnv,
  dimLevel,
  blurAmount,
  isLightMode
}) => {
  const list = isLightMode ? LIGHT_ENVIRONMENTS : DARK_ENVIRONMENTS;
  const activeEnv = list.find(e => e.id === currentEnv) || ALL_ENVIRONMENTS.find(e => e.id === currentEnv) || list[0];

  return (
    <div
      className="fixed inset-y-0 left-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        right: 'var(--scrollbar-width, 0px)'
      }}
      aria-hidden="true"
    >
      {/* Background Room Photo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-[filter,opacity] duration-700 ease-out will-change-transform"
        style={{
          backgroundImage: `url(${activeEnv.url})`,
          filter: blurAmount > 0
            ? `blur(${blurAmount}px) brightness(${isLightMode ? 0.96 : 0.72}) saturate(${isLightMode ? 1.15 : 1.25})`
            : `brightness(${isLightMode ? 0.95 : 0.75}) saturate(${isLightMode ? 1.05 : 1.15})`,
          transform: blurAmount > 0 ? 'scale(1.08)' : 'scale(1)'
        }}
      />

      {/* Dynamic Ambient Lighting Gradient Scrim */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundColor: isLightMode
            ? `rgba(240, 243, 248, ${dimLevel * 0.8})`
            : `rgba(10, 10, 14, ${dimLevel})`,
          backgroundImage: isLightMode
            ? 'radial-gradient(ellipse 90% 70% at 50% 10%, rgba(255, 255, 255, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 90% 70% at 50% 10%, rgba(255, 235, 210, 0.08) 0%, transparent 70%)'
        }}
      />

      {/* Subtle bottom gradient depth */}
      <div
        className={`absolute inset-x-0 bottom-0 h-64 pointer-events-none transition-opacity duration-700 ${
          isLightMode
            ? 'bg-gradient-to-t from-black/10 via-transparent to-transparent'
            : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
        }`}
      />
    </div>
  );
};
