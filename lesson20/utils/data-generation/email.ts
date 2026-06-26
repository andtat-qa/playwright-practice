import { faker } from "@faker-js/faker";

export function generateUniqueEmail(): string {
    return `andtat+${faker.string.nanoid(6)}@qamadness.com`;
}