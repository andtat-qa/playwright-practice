import { faker } from '@faker-js/faker';

export const generateUserData = () => {
    return {
        userName: faker.internet.username().replace(/\W/g, ''),
        password: faker.internet.password({ length: 12 }) + '@1A'
    };
};
