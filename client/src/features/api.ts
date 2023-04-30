const base_url = process.env.API_BASE_URL;

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
  service_point: string;
}

export interface City {
  uid: number;
  nom: string;
  unique_identifier: number;
  region: string;
}

const api = {
  getCategories: {
    key: "/categories",
    fetcher: (): Promise<Category[]> => fetch(`${base_url}/${api.getCategories.key}`).then((res) => res.json()),
  },
  getOutlets: {
    key: "/outlets",
    fetcher: (): Promise<Record<string, Outlet[]>> =>
      fetch(`${base_url}/${api.getOutlets.key}`).then((res) => res.json()),
  },
  getCities: {
    key: "/cities",
    fetcher: (): Promise<City[]> => fetch(`${base_url}/${api.getCities.key}`).then((res) => res.json()),
  },
};

export default api;
