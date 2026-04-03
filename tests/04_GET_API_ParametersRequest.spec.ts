import { test, expect } from '@playwright/test';
import { getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { faker } from "@faker-js/faker";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", {tag :['@sanity', '@get']}, async ({ request }) => {

    console.log('POST API Request and GET API Response using dynamic file with faker');

    // Request Body values
    const id = faker.number.int({ min: 101, max: 9999 });
    const author = faker.person.fullName();
    const category = faker.book.genre(); // This is working great but I will use random selection from an array
    const price = faker.number.int({ min: 100, max: 699 });
    const title = faker.book.title();

    // POST API Request
    // Create POST API Request body
    const postAPIRequestBody = await getPOSTAPIRequestBody(id, author, category, price, title); 
    // Create POST API Request Response
    const postAPIRequestResponse =await request.post(`books`, { data: postAPIRequestBody });
    // Create json POST API Response
    const jsonPOSTAPIResponse =await postAPIRequestResponse.json();

    // Validate POST API Response
    expect(postAPIRequestResponse.status()).toBe(201);
    expect(postAPIRequestResponse.statusText()).toBe('Created');
    expect(postAPIRequestResponse.headers()['content-type']).toContain('application/json');

    // Create GET API Request Response
    const getAPIRequestResponse = await request.get(`books?id=${jsonPOSTAPIResponse.id}`);
    const jsonGETAPIResponse = await getAPIRequestResponse.json();
    console.log('GET API Response by Hard Code param ID:'+JSON.stringify(jsonGETAPIResponse, null, 2));

    // Validate GET API Response
    expect(getAPIRequestResponse.status()).toBe(200);
    expect(getAPIRequestResponse.statusText()).toBe('OK');

    // Create GET API Request Response with param ID
    const getAPIResponseParamId = await request.get(`books`, {
        params: {
            id: id
        },
    });
    const jsonGETAPIResponseParam = await getAPIResponseParamId.json();
    console.log('GET API Response with params ID:'+JSON.stringify(jsonGETAPIResponseParam, null, 2));

    // Validate GET API Response
    expect(getAPIResponseParamId.status()).toBe(200);
    expect(getAPIResponseParamId.statusText()).toBe('OK');
    expect(getAPIResponseParamId.headers()['content-type']).toContain('application/json');
    expect(jsonGETAPIResponseParam[0].id).toBe(id);
    expect(jsonGETAPIResponseParam[0].author).toBe(author);
    expect(jsonGETAPIResponseParam[0].category).toBe(category);
    expect(jsonGETAPIResponseParam[0].price).toBe(price);
    expect(jsonGETAPIResponseParam[0].title).toBe(title);

    // Create GET API Request Response with param category
    const getAPIResponseParamCategory = await request.get(`books`, {
        params: {
            category: category
        },
    });
    const jsonGETAPIResponseParamCategory = await getAPIResponseParamCategory.json();
    console.log('GET API Response with params CATEGORY:'+JSON.stringify(jsonGETAPIResponseParamCategory, null, 2));

    // Validate GET API Response
    expect(getAPIResponseParamId.status()).toBe(201);
    expect(getAPIResponseParamId.statusText()).toBe('OK');
    expect(getAPIResponseParamId.headers()['content-type']).toContain('application/json');
    expect(jsonGETAPIResponseParam[0].category).toBe(category);

    // DELETE API Request
    // Create json DELETE API Request Response
    const deleteAPIResponse = await request.delete(`/books`, {
        params: { id: jsonPOSTAPIResponse.id } // pass ID as query param
    });

    // Validate the DELETE response
    expect(deleteAPIResponse.status()).toBe(204); // server returns 204 No Content
    console.log(`Deleted book with id: ${jsonPOSTAPIResponse.id}`);
})