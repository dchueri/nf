import { 
  Team, 
  TeamMember, 
  TeamRole, 
  TeamSettings,
  UserInvitation,
  InvitationStatus,
  UserProfile,
  TeamStats,
  UserSearchFilters,
  TeamSearchFilters,
  BulkUserOperation
} from '../types/team';

const API_BASE_URL = 'http://localhost:3001';

// Helper function for making authenticated requests
const request = async (endpoint: string, options: RequestInit = {}) => {
  // TODO: Get token from auth context
  const token = localStorage.getItem('authToken'); // Temporary solution
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Teams
export const getTeams = async () => {
  return request('/teams');
};

export const getTeamById = async (id: string) => {
  return request(`/teams/${id}`);
};

export const createTeam = async (teamData: any) => {
  return request('/teams', {
    method: 'POST',
    body: JSON.stringify(teamData),
  });
};

export const updateTeam = async (id: string, teamData: any) => {
  return request(`/teams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(teamData),
  });
};

export const deleteTeam = async (id: string) => {
  return request(`/teams/${id}`, {
    method: 'DELETE',
  });
};

export const searchTeams = async (query: string) => {
  return request(`/teams?search=${encodeURIComponent(query)}`);
};

export const getTeamMembers = async (teamId: string) => {
  return request(`/teams/${teamId}/members`);
};

export const addTeamMember = async (teamId: string, userId: string, role: string) => {
  return request(`/teams/${teamId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
};

export const updateTeamMember = async (teamId: string, userId: string, updates: any) => {
  return request(`/teams/${teamId}/members/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const removeTeamMember = async (teamId: string, userId: string) => {
  return request(`/teams/${teamId}/members/${userId}`, {
    method: 'DELETE',
  });
};

export const updateMemberRole = async (teamId: string, userId: string, role: string) => {
  return request(`/teams/${teamId}/members/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};

export const getTeamSettings = async (teamId: string) => {
  return request(`/teams/${teamId}/settings`);
};

export const updateTeamSettings = async (teamId: string, settings: any) => {
  return request(`/teams/${teamId}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
};

// Invitations
export const getInvitations = async () => {
  return request('/invitations');
};

export const getInvitationById = async (id: string) => {
  return request(`/invitations/${id}`);
};

export const createInvitation = async (invitationData: any) => {
  return request('/invitations', {
    method: 'POST',
    body: JSON.stringify(invitationData),
  });
};

export const updateInvitation = async (id: string, invitationData: any) => {
  return request(`/invitations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(invitationData),
  });
};

export const cancelInvitation = async (id: string) => {
  return request(`/invitations/${id}`, {
    method: 'DELETE',
  });
};

export const resendInvitation = async (id: string) => {
  return request(`/invitations/${id}/resend`, {
    method: 'POST',
  });
};

export const acceptInvitation = async (id: string) => {
  return request(`/invitations/${id}/accept`, {
    method: 'POST',
  });
};

export const declineInvitation = async (id: string) => {
  return request(`/invitations/${id}/decline`, {
    method: 'POST',
  });
};

// User Management
export const getUserProfile = async (userId: string) => {
  return request(`/users/${userId}`);
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  return request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
};

export const uploadAvatar = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return request(`/users/${userId}/avatar`, {
    method: 'POST',
    headers: {}, // Remove Content-Type to let browser set it for FormData
    body: formData,
  });
};

// Team Statistics and Analytics
export const getTeamStats = async (teamId: string) => {
  return request(`/teams/${teamId}/stats`);
};

export const getCompanyTeamStats = async () => {
  // This would be a company-wide endpoint
  return request('/teams/stats/company');
};

export const searchUsers = async (query: string, filters?: any) => {
  const params = new URLSearchParams({ search: query, ...filters });
  return request(`/users/search?${params}`);
};

export const bulkUserOperation = async (operation: string, userIds: string[], data?: any) => {
  return request('/users/bulk', {
    method: 'POST',
    body: JSON.stringify({ operation, userIds, data }),
  });
};

export const suspendUser = async (userId: string) => {
  return request(`/users/${userId}/suspend`, {
    method: 'POST',
  });
};

export const activateUser = async (userId: string) => {
  return request(`/users/${userId}/activate`, {
    method: 'POST',
  });
};

export const getTeamActivities = async (teamId: string, limit?: number) => {
  const params = limit ? `?limit=${limit}` : '';
  return request(`/teams/${teamId}/activities${params}`);
};

export const logTeamActivity = async (teamId: string, activity: any) => {
  return request(`/teams/${teamId}/activities`, {
    method: 'POST',
    body: JSON.stringify(activity),
  });
};

export const getUserPermissions = async (userId: string, teamId?: string) => {
  const params = teamId ? `?teamId=${teamId}` : '';
  return request(`/users/${userId}/permissions${params}`);
};

export const checkUserAccess = async (userId: string, resource: string, action: string) => {
  return request(`/users/${userId}/access`, {
    method: 'POST',
    body: JSON.stringify({ resource, action }),
  });
};

export const getTeamTemplates = async () => {
  return request('/teams/templates');
};

export const createTeamFromTemplate = async (templateId: string, data: any) => {
  return request(`/teams/templates/${templateId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const exportTeamData = async (teamId: string, format: string) => {
  return request(`/teams/${teamId}/export?format=${format}`);
};

export const exportUserList = async (format: string, filters?: any) => {
  const params = new URLSearchParams({ format, ...filters });
  return request(`/users/export?${params}`);
};
