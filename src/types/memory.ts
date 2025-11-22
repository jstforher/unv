export interface Memory {
  id: string;
  title: string;
  caption: string;
  media_url: string;
  media_type: 'image' | 'video' | 'audio';
  position_x: number;
  position_y: number;
  position_z: number;
  orbit_radius?: number;
  is_secret: boolean;
  is_featured: boolean;
  category: 'trip' | 'party' | 'random' | 'milestone';
  date?: string;
  order: number;
  thumbnail_url: string;
  is_accessible_publicly: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  music_url?: string;
  rotation_speed: number;
  show_particles: boolean;
  theme_colors: {
    bg_primary: string;
    bg_secondary: string;
    accent_primary: string;
    accent_secondary: string;
    accent_star: string;
    glass_bg: string;
    text_primary: string;
    text_secondary: string;
  };
  updated_at: string;
}

export interface MemoryNodeProps {
  memory: Memory;
  position: [number, number, number];
  onClick: (memory: Memory) => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

export interface UniverseSceneProps {
  memories: Memory[];
  settings: SiteSettings;
  onMemoryClick: (memory: Memory) => void;
  loading: boolean;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}