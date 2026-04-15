import { test, expect } from '@playwright/test';
import postAPIRequest from '../test-data/api_request/01_POST_API_StaticRequest.json';

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using static file", {tag :['@sanity', '@post']}, async ({ request }) => {    
    // POST API Request
    // Create POST API Request Response
    const postAPIRequestResponse =await request.post(`books`, { data: postAPIRequest }); 
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
    expect(jsonPOSTAPIResponse.id).toBe(postAPIRequest.id);
    expect(jsonPOSTAPIResponse.author).toBe(postAPIRequest.author);
    expect(jsonPOSTAPIResponse.category).toBe(postAPIRequest.category);
    expect(jsonPOSTAPIResponse.price).toBe(postAPIRequest.price);
    expect(jsonPOSTAPIResponse.title).toBe(postAPIRequest.title);

    // DELETE record from POST API Request
    // Create json DELETE API Response
    const deleteAPIResponse = await request.delete(`/books`, {
        params: { id: jsonPOSTAPIResponse.id } // pass ID as query param
    });

    // Validate the DELETE response
    expect(deleteAPIResponse.status()).toBe(204); // server returns 204 No Content
    console.log(`Deleted book with id: ${jsonPOSTAPIResponse.id}`);    
})