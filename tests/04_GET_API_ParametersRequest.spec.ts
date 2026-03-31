//import { test, expect } from "../src/fixtures/fixtures";
import { test, expect } from '@playwright/test';
import { formatAPIRequest, getPOSTAPIRequestBody } from "../src/utils/APIHelper";
import { Book } from "../src/interface/BookCreateAPI.interface";
import { faker } from "@faker-js/faker";

test.use({
    baseURL: process.env.BASE_API_URL,
})

test("POST API Request using dynamic file with faker", async ({ request }) => {

    console.log('POST API Request using dynamic file with faker');

    // Request Body values
    const id = faker.number.int({ min: 101, max: 9999 });
    const author = faker.person.fullName();
    const category = faker.book.genre(); // This is working great but I will use random selection from an array
    const price = faker.number.int({ min: 100, max: 699 });
    const title = faker.book.title();

    // POST API Request
    // Create POST API Request body
    const postAPIRequest = await getPOSTAPIRequestBody(id, author, category, price, title); 
    // Create POST API Request`
    const postAPIResponse =await request.post(`books`, { data: postAPIRequest });
    // Create json POST API Response
    const jsonPOSTAPIResponse =await postAPIResponse.json();
    console.log('POST API Response:'+JSON.stringify(jsonPOSTAPIResponse, null, 2));

    // Validate POST API Response
    expect(postAPIResponse.status()).toBe(201);
    expect(postAPIResponse.statusText()).toBe('Created');
    //console.log('POST API Response Headers:'+JSON.stringify(postAPIResponse.headers()['content-type'], null, 2));
    expect(postAPIResponse.headers()['content-type']).toContain('application/json');

    // Validate GET API Response
    const getAPIResponse = await request.get(`books?id=${jsonPOSTAPIResponse.id}`);
    const jsonGETAPIResponse = await getAPIResponse.json();
    console.log('GET API Response:'+JSON.stringify(jsonGETAPIResponse, null, 2));
    expect(getAPIResponse.status()).toBe(200);
    expect(getAPIResponse.statusText()).toBe('OK');

    // Validate GET API Response with param ID
    const getAPIResponseParamId = await request.get(`books`, {
        params: {
            id: id
        },
    });

    const jsonGETAPIResponseParam = await getAPIResponseParamId.json();
    console.log('GET API Response with params:'+JSON.stringify(jsonGETAPIResponseParam, null, 2));

    // Validate GET API Response
    expect(getAPIResponseParamId.status()).toBe(200);
    expect(getAPIResponseParamId.statusText()).toBe('OK');
    expect(getAPIResponseParamId.headers()['content-type']).toContain('application/json');
    //expect(jsonGETAPIResponseParam[0].id).toBe(id);
    console.log(jsonGETAPIResponseParam[0].id);
    expect(jsonGETAPIResponseParam[0].author).toBe(author);
    expect(jsonGETAPIResponseParam[0].category).toBe(category);
    expect(jsonGETAPIResponseParam[0].price).toBe(price);
    expect(jsonGETAPIResponseParam[0].title).toBe(title);

    // Validate GET API Response with param category
    const getAPIResponseParamCategory = await request.get(`books`, {
        params: {
            category: category
        },
    });

    const jsonGETAPIResponseParamCategory = await getAPIResponseParamCategory.json();
    //console.log('GET API Response with params:'+JSON.stringify(jsonGETAPIResponseParamCategory, null, 2));

    // Validate GET API Response
    expect(getAPIResponseParamId.status()).toBe(200);
    expect(getAPIResponseParamId.statusText()).toBe('OK');
    expect(getAPIResponseParamId.headers()['content-type']).toContain('application/json');
    expect(jsonGETAPIResponseParam[0].category).toBe(category);
})