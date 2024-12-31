export type UserTypeInfo={
  id: string;
  name: string;
  email?: string;
  phone: string;
  imageUrl?: string;
  address: string;
  website: string;
  type: string;
  description: string;
}

export type DonorType={
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl?: string;
  address: string;
}

export type volunteerType={
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl?: string;
  address: string;
  createdAt?: string;
}

export type OrganisationType={
  id: string;
  name: string;
  desciption: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}