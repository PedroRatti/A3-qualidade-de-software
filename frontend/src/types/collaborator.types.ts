export type Collaborator = {
    id: number;
    name: string;
    email: string;
    cpf: string;
    number: string | null;
    birth: string;
    role: string;
    is_active: boolean;
};