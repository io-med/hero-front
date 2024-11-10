import { HeroServer } from '../types/HeroServer';
import { client } from '../utils/fetchClient';

const path = 'heroes';

export const getHeroes = () => {
  return client.get<HeroServer[]>(path);
};

export const postHero = (hero: Omit<HeroServer, 'id' | 'images'>) => {
  return client.post<HeroServer>(path, hero as HeroServer);
};

export const patchHero = (id: number, heroInfo: Partial<HeroServer>) => {
  return client.patch<Partial<HeroServer>>(`${path}/${id}`, heroInfo);
};

export const deleteHero = (id: number) => {
  return client.delete<HeroServer>(`${path}/${id}`);
};
