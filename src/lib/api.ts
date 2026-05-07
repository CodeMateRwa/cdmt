import type {
  HomeContent,
  ServiceItem,
  SiteSettings,
  TeamMember,
  WorkProject,
} from './siteContent';
import type {
  ProgramContentOverride,
  ProgramPricing,
  ProgramKey,
} from './programs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  budget?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessagePayload {
  name: string;
  email: string;
  service: string;
  budget?: string;
  message: string;
}

export interface BootstrapPayload {
  home: HomeContent | null;
  imageOverrides: Record<string, string> | null;
  pricingOverrides: Partial<Record<ProgramKey, ProgramPricing>> | null;
  programContent: Partial<Record<ProgramKey, ProgramContentOverride>> | null;
  services: unknown[];
  settings: SiteSettings | null;
  team: unknown[];
  work: unknown[];
}

function toTeamMember(row: any): TeamMember {
  return { ...row, photo: { keywords: row.photoKeywords, sig: row.photoSig } };
}

function toWorkProject(row: any): WorkProject {
  return { ...row, photo: { keywords: row.photoKeywords, sig: row.photoSig } };
}

function toServiceItem(row: any): ServiceItem {
  return { ...row, photo: { keywords: row.photoKeywords, sig: row.photoSig } };
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const headers = new Headers(options.headers);

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error((errorPayload as any).error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  getAdminSession = () =>
    this.request<{ authenticated: boolean }>('/api/admin/session');

  loginAdmin = (password: string) =>
    this.request<{ authenticated: boolean }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

  logoutAdmin = () =>
    this.request<{ authenticated: boolean }>('/api/admin/logout', {
      method: 'POST',
    });

  getBootstrap = async () => {
    const payload = await this.request<BootstrapPayload>('/api/bootstrap');

    return {
      home: payload.home,
      imageOverrides: payload.imageOverrides,
      pricingOverrides: payload.pricingOverrides,
      programContent: payload.programContent,
      services: payload.services.map(toServiceItem),
      settings: payload.settings,
      team: payload.team.map(toTeamMember),
      work: payload.work.map(toWorkProject),
    };
  };

  getMessages = () => this.request<ContactMessage[]>('/api/messages');

  createMessage = (data: CreateMessagePayload) =>
    this.request<ContactMessage>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });

  markAsRead = (id: string) =>
    this.request<ContactMessage>(`/api/messages/${id}/read`, { method: 'PATCH' });

  deleteMessage = (id: string) =>
    this.request<{ success: boolean }>(`/api/messages/${id}`, {
      method: 'DELETE',
    });

  getTeam = async (): Promise<TeamMember[]> => {
    const rows = await this.request<any[]>('/api/team');
    return rows.map(toTeamMember);
  };

  saveTeam = (team: TeamMember[]) =>
    this.request<{ success: boolean }>('/api/team', {
      method: 'PUT',
      body: JSON.stringify(team),
    });

  getWork = async (): Promise<WorkProject[]> => {
    const rows = await this.request<any[]>('/api/work');
    return rows.map(toWorkProject);
  };

  saveWork = (work: WorkProject[]) =>
    this.request<{ success: boolean }>('/api/work', {
      method: 'PUT',
      body: JSON.stringify(work),
    });

  getServices = async (): Promise<ServiceItem[]> => {
    const rows = await this.request<any[]>('/api/services');
    return rows.map(toServiceItem);
  };

  saveServices = (services: ServiceItem[]) =>
    this.request<{ success: boolean }>('/api/services', {
      method: 'PUT',
      body: JSON.stringify(services),
    });

  getConfig = <T>(key: string) => this.request<T | null>(`/api/config/${key}`);

  saveConfig = <T>(key: string, value: T) =>
    this.request<{ success: boolean }>(`/api/config/${key}`, {
      method: 'PUT',
      body: JSON.stringify(value),
    });

  getSettings = () => this.getConfig<SiteSettings>('settings');
  saveSettings = (value: SiteSettings) => this.saveConfig('settings', value);

  getHomeContent = () => this.getConfig<HomeContent>('home');
  saveHomeContent = (value: HomeContent) => this.saveConfig('home', value);

  getPricingOverrides = () =>
    this.getConfig<Partial<Record<ProgramKey, ProgramPricing>>>('pricingOverrides');
  savePricingOverrides = (value: Partial<Record<ProgramKey, ProgramPricing>>) =>
    this.saveConfig('pricingOverrides', value);

  getProgramContent = () =>
    this.getConfig<Partial<Record<ProgramKey, ProgramContentOverride>>>(
      'programContent',
    );
  saveProgramContent = (
    value: Partial<Record<ProgramKey, ProgramContentOverride>>,
  ) => this.saveConfig('programContent', value);

  getImageOverrides = () => this.getConfig<Record<string, string>>('imageOverrides');
  saveImageOverrides = (value: Record<string, string>) =>
    this.saveConfig('imageOverrides', value);

  checkHealth = () =>
    this.request<{ status: string; timestamp: string }>('/api/health');
}

export const apiClient = new ApiClient();
