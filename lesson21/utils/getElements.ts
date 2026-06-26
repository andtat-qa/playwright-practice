import { Locator, Page } from "@playwright/test";

export async function getRandomElementFromList(list: Locator) {
    const numberOfProducts = await list.count();
    const randomProductIndex = Math.floor(Math.random() * numberOfProducts);
    return randomProductIndex;
}