import fetch from 'node-fetch';
import type { Page, Thread } from '../types/4chan.types';

const CATALOG_URL = 'https://a.4cdn.org/biz/catalog.json';

const getCatalog = async (): Promise<Page[]> => {
  const response = await fetch(CATALOG_URL);
  return response.json();
};

export const getCatalogThreads = async (): Promise<Thread[]> => {
  const pages = await getCatalog();

  return pages.reduce<Thread[]>((acc, curr) => {
    return acc.concat(curr.threads);
  }, []);
};

export const getThreadsThatInclude = (threads: Thread[], search: string) => {
  return threads.filter((thread) => {
    return (
      thread.name?.includes(search) ||
      thread.com?.includes(search) ||
      thread.filename?.includes(search)
    );
  });
};
