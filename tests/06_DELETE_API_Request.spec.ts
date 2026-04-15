//import { test, expect } from "../src/fixtures/fixtures";
import { test, expect } from '@playwright/test';
import { getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { generateBookData } from "../src/interface/BookData.interface";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("DELETE API Request after POST for Safety Type", {tag :['@sanity', '@delete']}, async ({ request }) => {
    // Get and Print Request Body
    const data = generateBookData();

    // POST API Request
    // Create POST API Request body
    const postAPIRequestBody = await getPOSTAPIRequestBody(data);
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