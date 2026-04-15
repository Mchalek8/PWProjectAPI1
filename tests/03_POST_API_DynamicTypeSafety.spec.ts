import { test, expect } from '@playwright/test';
import { getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { generateBookData } from "../src/interface/BookData.interface";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using Safety Type with faker", {tag :['@regression', '@post']}, async ({ request }) => {
    // Get data and Print
    const data = generateBookData();
    console.log('Request Body:');
    console.log(`id: ${data.id}`);
    console.log(`author: ${data.author}`);
    console.log(`category: ${data.category}`);
    console.log(`price: ${data.price}`);
    console.log(`title: ${data.title}`);

    // POST API Request
    // Create POST API Request body
    const postAPIRequestBody = await getPOSTAPIRequestBody(data); 
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
    expect(jsonPOSTAPIResponse.id).toBe(data.id);
    expect(jsonPOSTAPIResponse.author).toBe(data.author);
    expect(jsonPOSTAPIResponse.category).toBe(data.category);
    expect(jsonPOSTAPIResponse.price).toBe(data.price);
    expect(jsonPOSTAPIResponse.title).toBe(data.title);

    // // DELETE record from POST API Request
    // // Create json DELETE API Response
    // const deleteAPIResponse = await request.delete(`/books`, {
    //     params: { id: jsonPOSTAPIResponse.id } // pass ID as query param
    // });

    // // Validate the DELETE response
    // expect(deleteAPIResponse.status()).toBe(204); // server returns 204 No Content
    // console.log(`Deleted book with id: ${jsonPOSTAPIResponse.id}`);     
})