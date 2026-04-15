import { BookData } from "../interface/BookData.interface";
export async function formatAPIRequest(template: string, values: any[]): Promise<string> {
    return template.replace(/{(\d+)}/g, (match, p1) => {
        const index = parseInt(p1, 10);
        return index < values.length ? String(values[index]) : match;
    });
}

export async function getPOSTAPIRequestBody(
  data: BookData
): Promise<BookData> {
  const apiRequest: BookData = {
    id: data.id,
    author: data.author,
    category: data.category,
    price: data.price,
    title: data.title,
  };
  
  return apiRequest;
}