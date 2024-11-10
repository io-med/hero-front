import { Hero } from "../types/Hero";
import { HeroServer } from "../types/HeroServer";

export const convertToServerHero = (hero: Hero): Omit<HeroServer, 'id' | 'images'> => {
  return {
    nickname: hero.nickname,
    real_name: hero.realName,
    origin_description: hero.origin,
    superpowers: hero.powers,
    catch_phrase: hero.phrase,
  }
}
