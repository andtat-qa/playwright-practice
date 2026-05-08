import { Locator, Page } from "@playwright/test";

export async function getRandomElementIndexFromList(list: Locator) {
    const numberOfProducts = await list.count();
    const randomProductIndex = Math.floor(Math.random() * numberOfProducts);
    return randomProductIndex;
}

export function parsePrices(priceStrings: string[]): number[] {
    return priceStrings.map(price => parseFloat(price.replace('$', '')));
}

export function sortNumbersAscending(numbers: number[]): number[] {
    return [...numbers].sort((a, b) => a - b);
}