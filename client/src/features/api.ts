const base_url = "http://localhost:3000";

export interface Option {
  uid: number;
  title: string;
}

export interface Service {
  uid: number;
  title: string;
  options: Option[];
}

export interface Category {
  uid: number;
  name: string;
  services: Service[];
}

export interface Outlet {
  uid: number;
  name: string;
  gps_latitude: string;
  gps_longitude: string;
  city_uid: number;
}

export interface City {
  uid: number;
  nom: string;
  unique_identifier: number;
  region: string;
}

const api = {
  getCategories: {
    key: "/api/categories",
    fetcher: (): Promise<Category[]> => fetch(`${base_url}/${api.getCategories.key}`).then((res) => res.json()),
  },
  getOutlets: {
    key: "/api/outlets",
    fetcher: (): Promise<Record<string, Outlet[]>> =>
      fetch(`${base_url}/${api.getOutlets.key}`).then((res) => res.json()),
  },
  getCities: {
    key: "/api/cities",
    fetcher: (): Promise<City[]> => fetch(`${base_url}/${api.getCities.key}`).then((res) => res.json()),
  },
};

export default api;
