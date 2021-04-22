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
  const lowerCaseSearch = search.toLocaleLowerCase();

  return threads
    .filter((thread) => {
      return (
        thread.name?.toLocaleLowerCase().includes(lowerCaseSearch) ||
        thread.sub?.toLocaleLowerCase().includes(lowerCaseSearch) ||
        thread.com?.toLocaleLowerCase().includes(lowerCaseSearch) ||
        thread.filename?.toLocaleLowerCase().includes(lowerCaseSearch)
      );
    })
    .map((thread) => ({
      ...thread,
      name: thread.name?.replace(/\|/g, 'I'),
      com: thread.com?.replace(/\|/g, 'I'),
      sub: thread.sub?.replace(/\|/g, 'I'),
      filename: thread.filename?.replace(/\|/g, 'I'),
    }));
};
