export function getMenu(): { title: string; path: string; enabled: boolean }[] {
  return [
    { title: 'Companies', path: '/', enabled: true },
    { title: 'Portfolio', path: '/portfolio', enabled: true },
    { title: 'Create Company', path: '/company/create', enabled: true },
  ];
}
