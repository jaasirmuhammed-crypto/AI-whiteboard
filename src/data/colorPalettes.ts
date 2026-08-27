export interface PaletteColor {
  name: string;
  hex: string;
  rgb: string;
  family: ColorFamily;
  isLight?: boolean;
}

export type ColorFamily =
  | 'all'
  | 'blue'
  | 'cyan_teal'
  | 'green'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'brown'
  | 'grey'
  | 'black_white';

export interface FamilyGroup {
  id: ColorFamily;
  name: string;
  accent: string;
  colors: PaletteColor[];
}

export const COLOR_PALETTE_FAMILIES: FamilyGroup[] = [
  {
    id: 'blue',
    name: 'Blue',
    accent: '#2563eb',
    colors: [
      { name: 'Peaceful Blue', hex: '#b9d5fd', rgb: 'RGB(185, 213, 253)', family: 'blue', isLight: true },
      { name: 'Angel Blue', hex: '#a5c4f5', rgb: 'RGB(165, 196, 245)', family: 'blue', isLight: true },
      { name: 'Ice Blue', hex: '#cde4f7', rgb: 'RGB(205, 228, 247)', family: 'blue', isLight: true },
      { name: 'Robins Blue', hex: '#92c5ea', rgb: 'RGB(146, 197, 234)', family: 'blue', isLight: true },
      { name: 'Happy Sky', hex: '#60a5fa', rgb: 'RGB(96, 165, 250)', family: 'blue' },
      { name: 'Bright Blue', hex: '#38bdf8', rgb: 'RGB(56, 189, 248)', family: 'blue' },
      { name: 'Sky Blue', hex: '#0284c7', rgb: 'RGB(2, 132, 199)', family: 'blue' },
      { name: 'Happy Blue', hex: '#2563eb', rgb: 'RGB(37, 99, 235)', family: 'blue' },
      { name: 'Royal Blue', hex: '#1d4ed8', rgb: 'RGB(29, 78, 216)', family: 'blue' },
      { name: 'Blueberry', hex: '#1e3a8a', rgb: 'RGB(30, 58, 138)', family: 'blue' },
      { name: 'Navy Blue', hex: '#0f172a', rgb: 'RGB(15, 23, 42)', family: 'blue' },
      { name: 'Midnight Blue', hex: '#020617', rgb: 'RGB(2, 6, 23)', family: 'blue' },
    ],
  },
  {
    id: 'cyan_teal',
    name: 'Cyan / Teal',
    accent: '#0d9488',
    colors: [
      { name: 'Aqua Ice', hex: '#ccfbf1', rgb: 'RGB(204, 251, 241)', family: 'cyan_teal', isLight: true },
      { name: 'Aqua Blue', hex: '#38d9d6', rgb: 'RGB(56, 217, 214)', family: 'cyan_teal', isLight: true },
      { name: 'Aqua Mint', hex: '#2dd4bf', rgb: 'RGB(45, 212, 191)', family: 'cyan_teal' },
      { name: 'Turquoise Blue', hex: '#06b6d4', rgb: 'RGB(6, 182, 212)', family: 'cyan_teal' },
      { name: 'Teal', hex: '#0d9488', rgb: 'RGB(13, 148, 136)', family: 'cyan_teal' },
      { name: 'Medium Teal', hex: '#0f766e', rgb: 'RGB(15, 118, 110)', family: 'cyan_teal' },
      { name: 'Dark Teal', hex: '#115e59', rgb: 'RGB(17, 94, 89)', family: 'cyan_teal' },
      { name: 'Deep Sea Teal', hex: '#134e4a', rgb: 'RGB(19, 78, 74)', family: 'cyan_teal' },
    ],
  },
  {
    id: 'green',
    name: 'Green',
    accent: '#16a34a',
    colors: [
      { name: 'Pastel Green', hex: '#dcfce7', rgb: 'RGB(220, 252, 231)', family: 'green', isLight: true },
      { name: 'Celery Green', hex: '#bbf7d0', rgb: 'RGB(187, 247, 208)', family: 'green', isLight: true },
      { name: 'Pistachio', hex: '#86efac', rgb: 'RGB(134, 239, 172)', family: 'green', isLight: true },
      { name: 'Seafoam', hex: '#a7f3d0', rgb: 'RGB(167, 243, 208)', family: 'green', isLight: true },
      { name: 'Fresh Green', hex: '#84cc16', rgb: 'RGB(132, 204, 22)', family: 'green' },
      { name: 'Grass Green', hex: '#22c55e', rgb: 'RGB(34, 197, 94)', family: 'green' },
      { name: 'Emerald', hex: '#10b981', rgb: 'RGB(16, 185, 129)', family: 'green' },
      { name: 'Forest Green', hex: '#15803d', rgb: 'RGB(21, 128, 61)', family: 'green' },
      { name: 'Deep Pine', hex: '#14532d', rgb: 'RGB(20, 83, 45)', family: 'green' },
      { name: 'Olive Green', hex: '#3f6212', rgb: 'RGB(63, 98, 18)', family: 'green' },
    ],
  },
  {
    id: 'purple',
    name: 'Purple / Violet',
    accent: '#9333ea',
    colors: [
      { name: 'Pastel Lilac', hex: '#f3e8ff', rgb: 'RGB(243, 232, 255)', family: 'purple', isLight: true },
      { name: 'Lilac', hex: '#e9d5ff', rgb: 'RGB(233, 213, 255)', family: 'purple', isLight: true },
      { name: 'Lavender', hex: '#d8b4fe', rgb: 'RGB(216, 180, 254)', family: 'purple', isLight: true },
      { name: 'Plum Grey', hex: '#a855f7', rgb: 'RGB(168, 85, 247)', family: 'purple' },
      { name: 'Violet', hex: '#8b5cf6', rgb: 'RGB(139, 92, 246)', family: 'purple' },
      { name: 'Orchid Purple', hex: '#9333ea', rgb: 'RGB(147, 51, 234)', family: 'purple' },
      { name: 'Blue Violet', hex: '#6d28d9', rgb: 'RGB(109, 40, 217)', family: 'purple' },
      { name: 'Eggplant', hex: '#4c1d95', rgb: 'RGB(76, 29, 149)', family: 'purple' },
      { name: 'Deep Velvet', hex: '#581c87', rgb: 'RGB(88, 28, 135)', family: 'purple' },
      { name: 'Dark Indigo', hex: '#312e81', rgb: 'RGB(49, 46, 129)', family: 'purple' },
    ],
  },
  {
    id: 'pink',
    name: 'Pink',
    accent: '#db2777',
    colors: [
      { name: 'Pastel Pink', hex: '#fce7f3', rgb: 'RGB(252, 231, 243)', family: 'pink', isLight: true },
      { name: 'Cotton Candy', hex: '#fbcfe8', rgb: 'RGB(251, 207, 232)', family: 'pink', isLight: true },
      { name: 'Dusty Rose', hex: '#f472b6', rgb: 'RGB(244, 114, 182)', family: 'pink' },
      { name: 'Sweet Pink', hex: '#ec4899', rgb: 'RGB(236, 72, 153)', family: 'pink' },
      { name: 'Rose', hex: '#f43f5e', rgb: 'RGB(244, 63, 94)', family: 'pink' },
      { name: 'Hot Pink', hex: '#db2777', rgb: 'RGB(219, 39, 119)', family: 'pink' },
      { name: 'Mamey Pink', hex: '#e11d48', rgb: 'RGB(225, 29, 72)', family: 'pink' },
      { name: 'Fuchsia', hex: '#c026d3', rgb: 'RGB(192, 38, 211)', family: 'pink' },
      { name: 'Deep Magenta', hex: '#9d174d', rgb: 'RGB(157, 23, 77)', family: 'pink' },
      { name: 'Berry Wine', hex: '#831843', rgb: 'RGB(131, 24, 67)', family: 'pink' },
    ],
  },
  {
    id: 'red',
    name: 'Red',
    accent: '#dc2626',
    colors: [
      { name: 'Pale Peach', hex: '#ffe4e6', rgb: 'RGB(255, 228, 230)', family: 'red', isLight: true },
      { name: 'Soft Peach', hex: '#fecdd3', rgb: 'RGB(254, 205, 211)', family: 'red', isLight: true },
      { name: 'Light Coral', hex: '#fda4af', rgb: 'RGB(253, 164, 175)', family: 'red', isLight: true },
      { name: 'Honey Rust', hex: '#fb7185', rgb: 'RGB(251, 113, 133)', family: 'red' },
      { name: 'Coral Red', hex: '#f87171', rgb: 'RGB(248, 113, 113)', family: 'red' },
      { name: 'Bright Red', hex: '#ef4444', rgb: 'RGB(239, 68, 68)', family: 'red' },
      { name: 'Crimson Red', hex: '#dc2626', rgb: 'RGB(220, 38, 38)', family: 'red' },
      { name: 'Ruby Red', hex: '#b91c1c', rgb: 'RGB(185, 28, 28)', family: 'red' },
      { name: 'Wine Red', hex: '#991b1b', rgb: 'RGB(153, 27, 27)', family: 'red' },
      { name: 'Burgundy', hex: '#7f1d1d', rgb: 'RGB(127, 29, 29)', family: 'red' },
      { name: 'Maroon', hex: '#450a0a', rgb: 'RGB(69, 10, 10)', family: 'red' },
    ],
  },
  {
    id: 'orange',
    name: 'Orange',
    accent: '#ea580c',
    colors: [
      { name: 'Creamsicle', hex: '#ffedd5', rgb: 'RGB(255, 237, 213)', family: 'orange', isLight: true },
      { name: 'Apricot', hex: '#fed7aa', rgb: 'RGB(254, 215, 170)', family: 'orange', isLight: true },
      { name: 'Happy Orange', hex: '#fdba74', rgb: 'RGB(253, 186, 116)', family: 'orange', isLight: true },
      { name: 'Tangerine', hex: '#fb923c', rgb: 'RGB(251, 146, 60)', family: 'orange' },
      { name: 'Tango', hex: '#f97316', rgb: 'RGB(249, 115, 22)', family: 'orange' },
      { name: 'Burnt Orange', hex: '#ea580c', rgb: 'RGB(234, 88, 12)', family: 'orange' },
      { name: 'Pumpkin', hex: '#c2410c', rgb: 'RGB(194, 65, 12)', family: 'orange' },
      { name: 'Rust', hex: '#9a3412', rgb: 'RGB(154, 52, 18)', family: 'orange' },
      { name: 'Dark Amber', hex: '#7c2d12', rgb: 'RGB(124, 45, 18)', family: 'orange' },
    ],
  },
  {
    id: 'yellow',
    name: 'Yellow',
    accent: '#ca8a04',
    colors: [
      { name: 'Buttercup', hex: '#fef9c3', rgb: 'RGB(254, 249, 195)', family: 'yellow', isLight: true },
      { name: 'Vanilla', hex: '#fef08a', rgb: 'RGB(254, 240, 138)', family: 'yellow', isLight: true },
      { name: 'Honey Yellow', hex: '#fde047', rgb: 'RGB(253, 224, 71)', family: 'yellow', isLight: true },
      { name: 'Bright Yellow', hex: '#facc15', rgb: 'RGB(250, 204, 21)', family: 'yellow', isLight: true },
      { name: 'Sunny Yellow', hex: '#eab308', rgb: 'RGB(234, 179, 8)', family: 'yellow' },
      { name: 'Goldenrod', hex: '#d97706', rgb: 'RGB(217, 119, 6)', family: 'yellow' },
      { name: 'Mustard Yellow', hex: '#ca8a04', rgb: 'RGB(202, 138, 4)', family: 'yellow' },
      { name: 'Dark Ochre', hex: '#a16207', rgb: 'RGB(161, 98, 7)', family: 'yellow' },
      { name: 'Amber Gold', hex: '#713f12', rgb: 'RGB(113, 63, 18)', family: 'yellow' },
    ],
  },
  {
    id: 'brown',
    name: 'Brown',
    accent: '#78350f',
    colors: [
      { name: 'Sand', hex: '#f5f5f4', rgb: 'RGB(245, 245, 244)', family: 'brown', isLight: true },
      { name: 'Tan', hex: '#e7e5e4', rgb: 'RGB(231, 229, 228)', family: 'brown', isLight: true },
      { name: 'Soft Taupe', hex: '#d6d3d1', rgb: 'RGB(214, 211, 209)', family: 'brown', isLight: true },
      { name: 'Taupe', hex: '#a8a29e', rgb: 'RGB(168, 162, 158)', family: 'brown' },
      { name: 'Camel', hex: '#d97706', rgb: 'RGB(217, 119, 6)', family: 'brown' },
      { name: 'Leather', hex: '#92400e', rgb: 'RGB(146, 64, 14)', family: 'brown' },
      { name: 'Chocolate', hex: '#78350f', rgb: 'RGB(120, 53, 15)', family: 'brown' },
      { name: 'Dark Brown', hex: '#451a03', rgb: 'RGB(69, 26, 3)', family: 'brown' },
      { name: 'Espresso', hex: '#2e1065', rgb: 'RGB(46, 16, 101)', family: 'brown' },
    ],
  },
  {
    id: 'grey',
    name: 'Grey',
    accent: '#64748b',
    colors: [
      { name: 'Platinum Grey', hex: '#f8fafc', rgb: 'RGB(248, 250, 252)', family: 'grey', isLight: true },
      { name: 'Soft Grey', hex: '#f1f5f9', rgb: 'RGB(241, 245, 249)', family: 'grey', isLight: true },
      { name: 'Light Slate', hex: '#e2e8f0', rgb: 'RGB(226, 232, 240)', family: 'grey', isLight: true },
      { name: 'Silver Grey', hex: '#cbd5e1', rgb: 'RGB(203, 213, 225)', family: 'grey', isLight: true },
      { name: 'Cool Grey', hex: '#94a3b8', rgb: 'RGB(148, 163, 184)', family: 'grey' },
      { name: 'Slate Grey', hex: '#64748b', rgb: 'RGB(100, 116, 139)', family: 'grey' },
      { name: 'Steel Grey', hex: '#475569', rgb: 'RGB(71, 85, 105)', family: 'grey' },
      { name: 'Charcoal Grey', hex: '#334155', rgb: 'RGB(51, 65, 85)', family: 'grey' },
    ],
  },
  {
    id: 'black_white',
    name: 'Black & White',
    accent: '#0f172a',
    colors: [
      { name: 'Pure White', hex: '#ffffff', rgb: 'RGB(255, 255, 255)', family: 'black_white', isLight: true },
      { name: 'Pearl White', hex: '#fafafa', rgb: 'RGB(250, 250, 250)', family: 'black_white', isLight: true },
      { name: 'Ivory White', hex: '#f5f5f5', rgb: 'RGB(245, 245, 245)', family: 'black_white', isLight: true },
      { name: 'Smoky Dark', hex: '#27272a', rgb: 'RGB(39, 39, 42)', family: 'black_white' },
      { name: 'Charcoal Black', hex: '#1e293b', rgb: 'RGB(30, 41, 59)', family: 'black_white' },
      { name: 'Obsidian Black', hex: '#18181b', rgb: 'RGB(24, 24, 27)', family: 'black_white' },
      { name: 'Pitch Black', hex: '#0f172a', rgb: 'RGB(15, 23, 42)', family: 'black_white' },
      { name: 'Jet Black', hex: '#000000', rgb: 'RGB(0, 0, 0)', family: 'black_white' },
    ],
  },
];

export const ALL_PALETTE_COLORS: PaletteColor[] = COLOR_PALETTE_FAMILIES.flatMap(
  (family) => family.colors
);

export function hexToRgbString(hex: string): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return 'RGB(0, 0, 0)';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `RGB(${r}, ${g}, ${b})`;
}
