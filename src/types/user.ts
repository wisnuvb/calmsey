export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "VIEWER";
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    articles: number;
    media: number;
    sessions: number;
  };
}

export interface UserStats {
  total: number;
  superAdmins: number;
  admins: number;
  editors: number;
  authors: number;
  viewers: number;
  verified: number;
  unverified: number;
}

export type RoleFilter =
  | "all"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "AUTHOR"
  | "VIEWER";

export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  EDITOR: 3,
  AUTHOR: 2,
  VIEWER: 1,
};

export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrator",
  EDITOR: "Editor",
  AUTHOR: "Author",
  VIEWER: "Viewer",
};

export const ROLE_DESCRIPTIONS = {
  SUPER_ADMIN: "Full system access and user management",
  ADMIN: "Manage content and users (except Super Admins)",
  EDITOR: "Create, edit, and publish content",
  AUTHOR: "Create and edit own content",
  VIEWER: "Read-only access to content",
};
