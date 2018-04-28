export interface RequestService {
  category: string;
  appointment_date: string;
  description: string;
  status: string;
  address: string;
  pictureUrl?: string,
  providerId?: string;
  category_description?: string;
  provider_name?: string;
  id?: string;
  uid?: string;
}

export interface ServiceCategories {
  description: string;
  id?: string;
}