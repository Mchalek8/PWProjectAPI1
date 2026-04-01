//import { test, expect } from "../src/fixtures/fixtures";
import { test, expect } from '@playwright/test';
import { getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { faker } from "@faker-js/faker";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", {tag : ['@API', '@DELETE']}, async ({ request }) => {

    console.log('POST API Request using dynamic file with faker');

    // Request Body values
    const id = faker.number.int({ min: 101, max: 9999 });
    const author = faker.person.fullName();
    const category = faker.book.genre();
    const price = faker.number.int({ min: 100, max: 699 });
    const title = faker.book.title();

    // POST API Request
    // Create POST API Request body
    const postAPIRequestBody = await getPOSTAPIRequestBody(id, author, category, price, title); 
    // Create POST API Request Response
    const postAPIRequestResponse =await request.post(`books`, { data: postAPIRequestBody });
    // Create json POST API Response
    const jsonPOSTAPIResponse =await postAPIRequestResponse.json();
    console.log('POST API Response:'+JSON.stringify(jsonPOSTAPIResponse, null, 2));

    // DELETE API Request
    // Create json DELETE API Response
    const deleteAPIResponse = await request.delete(`/books`, {
        params: { id: jsonPOSTAPIResponse.id } // pass ID as query param
    });

    // Validate the DELETE response
    expect(deleteAPIResponse.status()).toBe(204); // server returns 204 No Content
    console.log(`Deleted book with id: ${jsonPOSTAPIResponse.id}`);
})