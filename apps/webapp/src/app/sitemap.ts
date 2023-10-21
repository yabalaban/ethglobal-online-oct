import { globalStateAtom } from '@/lib';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = ['company/create', 'portfolio'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const companiesPromise = Object.values(gs.companies).map((company) => ({
    url: `${baseUrl}/company/${company.projectId}`,
    lastModified: new Date().toISOString(),
  }));

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (await Promise.all([companiesPromise])).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
