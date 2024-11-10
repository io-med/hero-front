type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

const request = async <T>(
  path: string,
  method: RequestMethod = 'GET',
  data?: T,
): Promise<T> => {
  const options: RequestInit = {
    method,
    body: data ? JSON.stringify(data) : null,
    headers : DEFAULT_HEADERS,
  };

  const response = await fetch(`${BASE_URL}/${path}`, options);

  return response.json();
};

const formRequest = async (
  path: string,
  method: RequestMethod = 'GET',
  data?: FormData,
) => {
  const options: RequestInit = {
    method,
    body: data ? data : null,
  };

  const response = await fetch(`${BASE_URL}/${path}`, options);

  return response.json();
}

export const client = {
  get<T>(path: string) {
    return request<T>(path);
  },

  post<T>(path: string, data: T): Promise<T> {
    return request<T>(path, 'POST', data);
  },

  patch<T>(path: string, data: T): Promise<T> {
    return request<T>(path, 'PATCH', data);
  },

  delete<T>(path: string, data?: T): Promise<T> {
    return request<T>(path, 'DELETE', data);
  },

  postForm(path: string, data: FormData) {
    return formRequest(path, 'POST', data);
  },
};
