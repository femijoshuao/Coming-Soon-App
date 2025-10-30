import React from 'react';

/**
 * A mapping of simple names to their corresponding Font Awesome class strings.
 * This abstraction makes it easy to change the icon set or specific icons in one place.
 */
const ICON_MAP = {
  x: 'fa-brands fa-x-twitter',
  instagram: 'fa-brands fa-instagram',
  youtube: 'fa-brands fa-youtube',
  whatsapp: 'fa-brands fa-whatsapp',
  facebook: 'fa-brands fa-facebook',
  linkedin: 'fa-brands fa-linkedin',
  github: 'fa-brands fa-github',
  tiktok: 'fa-brands fa-tiktok',
  snapchat: 'fa-brands fa-snapchat',
  pinterest: 'fa-brands fa-pinterest',
  reddit: 'fa-brands fa-reddit',
  discord: 'fa-brands fa-discord',
  telegram: 'fa-brands fa-telegram',
  twitch: 'fa-brands fa-twitch',
  spotify: 'fa-brands fa-spotify',
  medium: 'fa-brands fa-medium',
  dribbble: 'fa-brands fa-dribbble',
  behance: 'fa-brands fa-behance',
  gear: 'fa-solid fa-gear',
  sun: 'fa-solid fa-sun',
  moon: 'fa-solid fa-moon',
  close: 'fa-solid fa-xmark',
  plus: 'fa-solid fa-plus',
  trash: 'fa-solid fa-trash',
  search: 'fa-solid fa-magnifying-glass',
  'chevron-left': 'fa-solid fa-chevron-left',
  'chevron-right': 'fa-solid fa-chevron-right',
  image: 'fa-solid fa-image',
  upload: 'fa-solid fa-upload',
} as const; // Use 'as const' for stricter typing on keys

// Defines the possible names for the icons, derived from the keys of ICON_MAP.
export type IconName = keyof typeof ICON_MAP;

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconName;
}

/**
 * Renders an icon using Font Awesome.
 * This component takes a simple `name` prop and maps it to the appropriate
 * Font Awesome classes, rendering an `<i>` element.
 */
const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const iconClass = ICON_MAP[name];

  return <i className={`${iconClass} ${className || ''}`} {...props} aria-hidden="true" />;
};

export default Icon;