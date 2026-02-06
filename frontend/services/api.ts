export const api = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  };

  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message || "Erro na requisição");
  }

  return res.json();
};
