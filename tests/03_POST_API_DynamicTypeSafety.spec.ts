//import { test, expect } from "../src/fixtures/fixtures";
import { test, expect } from '@playwright/test';
import { formatAPIRequest, getPOSTAPIRequestBody } from "../src/utils/APIHelper";
//import { Book } from "../src/interface/BookCreateAPI.interface";
import { faker } from "@faker-js/faker";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", async ({ request }) => {

    // Request Body values
    const id = faker.number.int({ min: 101, max: 9999 });
    const author = faker.person.fullName();
    const category = faker.book.genre(); // This is working great but I will use random selection from an array
    const price = faker.number.int({ min: 100, max: 699 });
    const title = faker.book.title();

    // Print Request Body
    console.log('Request Body:');
    console.log(`id: ${id}`);
    console.log(`author: ${author}`);
    console.log(`category: ${category}`);
    console.log(`price: ${price}`);
    console.log(`title: ${title}`);

    // Create POST API Request body
    const postAPIRequest = await getPOSTAPIRequestBody(id, author, category, price, title); 

    // // Create POST API Request`
    const postAPIResponse =await request.post(`books`, { data: postAPIRequest });

    // Print POST API Response
    const jsonPOSTAPIResponse =await postAPIResponse.json();
    console.log('POST API Response:'+JSON.stringify(jsonPOSTAPIResponse, null, 2));

    // Validate POST API Response
    expect(postAPIResponse.status()).toBe(201);
    expect(postAPIResponse.statusText()).toBe('Created');
    console.log('POST API Response Headers:'+JSON.stringify(postAPIResponse.headers()['content-type'], null, 2));
    expect(postAPIResponse.headers()['content-type']).toContain('application/json');

    // Validate property/key names
    expect(jsonPOSTAPIResponse).toHaveProperty('id');
    expect(jsonPOSTAPIResponse).toHaveProperty('author');
    expect(jsonPOSTAPIResponse).toHaveProperty('category');
    expect(jsonPOSTAPIResponse).toHaveProperty('price');
    expect(jsonPOSTAPIResponse).toHaveProperty('title');

    // Validate API response body
    expect(jsonPOSTAPIResponse.id).toBe(id);
    expect(jsonPOSTAPIResponse.author).toBe(author);
    expect(jsonPOSTAPIResponse.category).toBe(category);
    expect(jsonPOSTAPIResponse.price).toBe(price);
    expect(jsonPOSTAPIResponse.title).toBe(title);
})