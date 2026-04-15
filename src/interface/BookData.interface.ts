import { faker } from '@faker-js/faker';
export interface BookData {
  id: number;
  author: string;
  category: string;
  price: number;
  title: string;
}

export function generateBookData(): BookData {
  return {
    id: faker.number.int({ min: 101, max: 9999 }),
    author: faker.person.fullName(),
    category: faker.book.genre(),
    price: faker.number.int({ min: 100, max: 699 }),
    title: faker.book.title(),
  };
}