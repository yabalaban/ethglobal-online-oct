import { Menu } from './types';

export function getMenu(): Menu[] {
  return [
    { title: 'Companies', path: 'kek', enabled: true },
    { title: 'Portfolio', path: 'lol', enabled: false },
  ];
}
