export type Child = {
  id: string;
  name: string;
  birthDate?: string;
  avatar?: string;
  goal?: string;
};

export type CreateChildInput = Omit<Child, 'id'>;
export type UpdateChildInput = Partial<CreateChildInput>;
