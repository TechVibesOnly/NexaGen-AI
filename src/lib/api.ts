// Enterprise API client for NeXaGen AI

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
};

export const authApi = {
  login: (credentials: any) => apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  logout: () => apiFetch("/api/auth/logout", {
    method: "POST",
  }),
};

export const verticalApi = {
  getStats: () => apiFetch("/api/dashboard/stats"),
  predict: (data: any) => apiFetch("/api/predict", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  uploadFile: (formData: FormData) => fetch("/api/upload", {
    method: "POST",
    body: formData,
    // Note: Don't set Content-Type header for FormData, browser does it with boundary
  }).then(res => res.json()),
};
