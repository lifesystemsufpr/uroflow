export type Child = {
  id: string;
  name: string;
  birthDate?: string; // ISO format YYYY-MM-DD
  avatar?: string;
  goal?: string;
};

export type CreateChildInput = Omit<Child, 'id'>;
export type UpdateChildInput = Partial<CreateChildInput>;
