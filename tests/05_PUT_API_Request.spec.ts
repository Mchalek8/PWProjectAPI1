import { test, expect } from '@playwright/test';
import { getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { faker } from "@faker-js/faker";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", {tag :['@sanity', '@put']}, async ({ request }) => {

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

    // Validate GET API Response
    const getAPIResponse = await request.get(`/books?id=${jsonPOSTAPIResponse.id}`);
    const jsonGETAPIResponse = await getAPIResponse.json();
    console.log('GET API Response:'+JSON.stringify(jsonGETAPIResponse, null, 2));
    expect(getAPIResponse.status()).toBe(200);
    expect(getAPIResponse.statusText()).toBe('OK');
    expect(jsonGETAPIResponse[0].title).toBe(title);   

    // Create PUT API Request body
    const updatedBody = {
    id: jsonPOSTAPIResponse.id,
    author: jsonPOSTAPIResponse.author,
    category: jsonPOSTAPIResponse.category,
    price: jsonPOSTAPIResponse.price,
    title: "Updated Title"
    };

    // PUT API Request Response
    const putAPIRequestResponse = await request.put(`/books/${jsonPOSTAPIResponse.id}`, {
    data: updatedBody
    });
    console.log('PUT API Response:'+JSON.stringify(putAPIRequestResponse, null, 2));
    expect(putAPIRequestResponse.status()).toBe(200);

    // Validate PUT API Response
    expect(putAPIRequestResponse.status()).toBe(200);
    expect(putAPIRequestResponse.statusText()).toBe('OK');
    expect(putAPIRequestResponse.headers()['content-type']).toContain('application/json');

    // Validate GET API Response with param ID
    const getAPIResponseParamId = await request.get(`/books/`, {
        params: {
            id: id
        },
    });
    const jsonGETAPIResponseParam = await getAPIResponseParamId.json();
    console.log('GET API Response with params:'+JSON.stringify(jsonGETAPIResponseParam, null, 2));

    // Validate GET API Response
    expect(getAPIResponseParamId.status()).toBe(200);
    expect(getAPIResponseParamId.statusText()).toBe('OK');
    expect(jsonGETAPIResponseParam[0].title).toBe("Updated Title");    

    // DELETE API Request
    // Create json DELETE API Response
    const deleteAPIResponse = await request.delete(`/books`, {
        params: { id: jsonPOSTAPIResponse.id } // pass ID as query param
    });

    // Validate the DELETE response
    expect(deleteAPIResponse.status()).toBe(204); // server returns 204 No Content
    console.log(`Deleted book with id: ${jsonPOSTAPIResponse.id}`);    
})