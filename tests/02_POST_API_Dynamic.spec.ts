import { test, expect } from '@playwright/test';
import { formatAPIRequest } from "../src/utils/APIHelper";
import { generateBookData } from "../src/interface/BookData.interface";
import path from 'path';
import fs from 'fs';

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", {tag :['@regression', '@post']}, async ({ request }) => {    
    // Reading JSON template file
    const filePath = path.join(__dirname,'../test-data/api_request/02_POST_API_DynamicRequest.json');
    const jsonTemplate = fs.readFileSync(filePath, 'utf-8'); 

    // Get data and Create values array
    const data = generateBookData();
    const values = [
        data.id,
        data.author,
        data.category,
        data.price,
        data.title,
    ];

    // Updating POST API Request body
    const postAPIRequestBody = await formatAPIRequest(jsonTemplate, values);    

    // POST API Request
    // Create POST API Request Response
    const postAPIRequestResponse =await request.post(`books`, { data: JSON.parse(postAPIRequestBody) }); 
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
    expect(jsonPOSTAPIResponse.id).toBe(data.id.toString());
    expect(jsonPOSTAPIResponse.author).toBe(data.author);
    expect(jsonPOSTAPIResponse.category).toBe(data.category);
    expect(jsonPOSTAPIResponse.price).toBe(data.price.toString());
    expect(jsonPOSTAPIResponse.title).toBe(data.title);

    // DELETE record from POST API Request
    // Create json DELETE API Response
    const deleteAPIResponse = await request.delete(`/books`, {
        params: { id: String(jsonPOSTAPIResponse.id)} // pass ID as String query param
    });

    // Validate the DELETE response
    expect(deleteAPIResponse.status()).toBe(204); // server returns 204 No Content
    console.log(`Deleted book with id: ${jsonPOSTAPIResponse.id}`);    
})