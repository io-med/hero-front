import { Hero } from "../types/Hero";
import { HeroServer } from "../types/HeroServer";

export const convertFromServerHero = (serverHero: HeroServer): Hero => {
  return {
    id: serverHero.id,
    nickname: serverHero.nickname,
    realName: serverHero.real_name,
    origin: serverHero.origin_description,
    powers: serverHero.superpowers,
    phrase: serverHero.catch_phrase,
    images: serverHero.images,
  }
}
