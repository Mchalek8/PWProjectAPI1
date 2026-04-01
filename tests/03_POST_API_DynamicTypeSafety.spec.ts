import { test, expect } from '@playwright/test';
import { getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { faker } from "@faker-js/faker";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", {tag :['@API', '@POST']}, async ({ request }) => {

    // Request Body values
    const id = faker.number.int({ min: 101, max: 9999 });
    const author = faker.person.fullName();
    const category = faker.book.genre();
    const price = faker.number.int({ min: 100, max: 699 });
    const title = faker.book.title();

    // Print Request Body
    console.log('Request Body:');
    console.log(`id: ${id}`);
    console.log(`author: ${author}`);
    console.log(`category: ${category}`);
    console.log(`price: ${price}`);
    console.log(`title: ${title}`);

    // POST API Request
    // Create POST API Request body
    const postAPIRequestBody = await getPOSTAPIRequestBody(id, author, category, price, title); 
    // Create POST API Request Response
    const postAPIRequestResponse =await request.post(`books`, { data: postAPIRequestBody });
    // Create json POST API Response
    const jsonPOSTAPIResponse =await postAPIRequestResponse.json();
    console.log('POST API Response:'+JSON.stringify(jsonPOSTAPIResponse, null, 2));

    // Validate POST API Response
    expect(postAPIRequestResponse.status()).toBe(201);
    expect(postAPIRequestResponse.statusText()).toBe('Created');
    console.log('POST API Response Headers:'+JSON.stringify(postAPIRequestResponse.headers()['content-type'], null, 2));
    expect(postAPIRequestResponse.headers()['content-type']).toContain('application/json');

    // Validate property/key names
    expect(jsonPOSTAPIResponse).toHaveProperty('id');
    expect(jsonPOSTAPIResponse).toHaveProperty('author');
    expect(jsonPOSTAPIResponse).toHaveProperty('category');
    expect(jsonPOSTAPIResponse).toHaveProperty('price');
    expect(jsonPOSTAPIResponse).toHaveProperty('title');

    // Validate POST API response body
    expect(jsonPOSTAPIResponse.id).toBe(id);
    expect(jsonPOSTAPIResponse.author).toBe(author);
    expect(jsonPOSTAPIResponse.category).toBe(category);
    expect(jsonPOSTAPIResponse.price).toBe(price);
    expect(jsonPOSTAPIResponse.title).toBe(title);
})