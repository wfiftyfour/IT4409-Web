export interface JwtPayload {
  id: string;
  email: string;
  rolesByWorkspace?: { wsId: string; role: string }[];
  rolesByChannel?: { chId: string; role: string }[];
}
