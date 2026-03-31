import { Book } from "../../src/interface/BookCreateAPI.interface"; // adjust path if needed
export async function formatAPIRequest(template: string, values: any[]): Promise<string> {
    return template.replace(/{(\d+)}/g, (match, p1) => {
        const index = parseInt(p1, 10);
        return index < values.length ? String(values[index]) : match;
    });
}

export async function getPOSTAPIRequestBody(
  id: number,
  author: string,
  category: string,
  price: number,
  title: string,
): Promise<Book> {
  const apiRequest: Book = {
    id: id,
    author: author,
    category: category,
    price: price,
    title: title,
  };
  
  return apiRequest;
}