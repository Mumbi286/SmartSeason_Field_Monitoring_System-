import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "admin" | "agent";
export type FieldStage = "Planted" | "Growing" | "Ready" | "Harvested";
export type FieldStatus = "Active" | "At Risk" | "Completed";

// Dashboard Summary Type
type DashboardSummary = {
  total: number;
  active: number;
  atRisk: number;
  completed: number;
};
// App User Type
export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

// Field Update Type
export type FieldUpdate = {
  id: string;
  fieldId: string;
  agentId: string;
  stage: FieldStage;
  note: string;
  createdAt: string;
};

// Field Record Type
export type FieldRecord = {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  status: FieldStatus;
  assignedAgentId?: string;
  updates: FieldUpdate[];
};

// Mutation Result Type
type MutationResult = { success: boolean; message?: string };
// Login Result Type
type LoginResult = MutationResult & { role?: UserRole };

// App Context Value Type
type AppContextValue = {
  isHydrated: boolean;
  users: AppUser[];
  currentUser: AppUser | null;
  fields: FieldRecord[];
  dashboardSummary: DashboardSummary;
  login: (email: string, password: string) => Promise<LoginResult>;
  registerUser: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<MutationResult>; // Register User
  logout: () => void;
  createField: (payload: {
    name: string;
    cropType: string;
    plantingDate: string;
    assignedAgentId?: string;
  }) => Promise<MutationResult>; // Create Field
  assignField: (fieldId: string, agentId?: string) => Promise<MutationResult>; // Assign Field
  updateFieldProgress: (payload: {
    fieldId: string;
    stage: FieldStage;
    note: string;
  }) => Promise<MutationResult>; // Update Field Progress
  getFieldStatus: (field: FieldRecord) => FieldStatus;
};

// Backend User Typ
type BackendUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

// Backend Auth Response Type
type BackendAuthResponse = {
  access_token: string;
  token_type: string;
  user: BackendUser;
};

// Backend Field Type
type BackendField = {
  id: number;
  name: string;
  crop_type: string;
  planting_date: string;
  current_stage: FieldStage;
  assigned_agent_id: number | null;
  created_by: number;
  created_at: string;
  status: FieldStatus;
};

// Backend Field Update Type
type BackendFieldUpdate = {
  id: number;
  field_id: number;
  agent_id: number;
  stage: FieldStage;
  note: string | null;
  created_at: string;
};

// Stored Session Type
type StoredSession = {
  token: string;
  user: AppUser;
};

// Session Storage Key
const SESSION_STORAGE_KEY = "smartseason.session";
// API Base URL
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "http://127.0.0.1:8000";

// Empty Summary
const emptySummary: DashboardSummary = { total: 0, active: 0, atRisk: 0, completed: 0 };
const AppContext = createContext<AppContextValue | null>(null);

// Map Backend User to App User
const mapUser = (user: BackendUser): AppUser => ({
  id: String(user.id),
  name: user.name,
  email: user.email,
  role: user.role,
});

// Map Backend Field Update to App Field Update
const mapFieldUpdate = (update: BackendFieldUpdate): FieldUpdate => ({
  id: String(update.id),
  fieldId: String(update.field_id),
  agentId: String(update.agent_id),
  stage: update.stage,
  note: update.note ?? "",
  createdAt: update.created_at.slice(0, 10),
});

// Map Backend Field to App Field
const mapField = (field: BackendField, updates: FieldUpdate[]): FieldRecord => ({
  id: String(field.id),
  name: field.name,
  cropType: field.crop_type,
  plantingDate: field.planting_date,
  currentStage: field.current_stage,
  assignedAgentId: field.assigned_agent_id != null ? String(field.assigned_agent_id) : undefined,
  status: field.status,
  updates,
});

// App Provider
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [fields, setFields] = useState<FieldRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary>(emptySummary);

  const persistSession = (nextToken: string | null, nextUser: AppUser | null) => {
    if (typeof window === "undefined") return;

    if (!nextToken || !nextUser) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    const payload: StoredSession = { token: nextToken, user: nextUser };
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  };

  const fetchJson = async <T,>(path: string, init: RequestInit = {}, authToken?: string): Promise<T> => {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
    if (!response.ok) {
      let detail = "Request failed.";
      try {
        const body = (await response.json()) as { detail?: string };
        if (body?.detail) detail = body.detail;
      } catch {
        // ignore non-json error bodies
      }
      throw new Error(detail);
    }
    return (await response.json()) as T;
  };

  const hydrateUserDirectory = async (authToken: string, authUser: AppUser) => {
    if (authUser.role !== "admin") {
      setUsers([authUser]);
      return;
    }

    try {
      const agents = await fetchJson<BackendUser[]>("/users/agents", {}, authToken);
      const allUsers = [authUser, ...agents.map(mapUser)];
      const uniqueUsers = Array.from(new Map(allUsers.map((user) => [user.id, user])).values());
      setUsers(uniqueUsers);
    } catch {
      setUsers([authUser]);
    }
  };

  const hydrateFields = async (authToken: string) => {
    const backendFields = await fetchJson<BackendField[]>("/fields", {}, authToken);
    const fieldsWithUpdates = await Promise.all(
      backendFields.map(async (field) => {
        const updates = await fetchJson<BackendFieldUpdate[]>(
          `/fields/${field.id}/updates`,
          {},
          authToken
        );
        return mapField(field, updates.map(mapFieldUpdate));
      })
    );
    setFields(fieldsWithUpdates);
  };

  const hydrateSummary = async (authToken: string) => {
    const summary = await fetchJson<DashboardSummary>("/dashboard/summary", {}, authToken);
    setDashboardSummary(summary);
  };

  const hydrateAfterAuth = async (authToken: string, authUser: AppUser) => {
    await Promise.all([
      hydrateUserDirectory(authToken, authUser),
      hydrateFields(authToken),
      hydrateSummary(authToken),
    ]);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hydrate = async () => {
      const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSession) {
        setIsHydrated(true);
        return;
      }

      try {
        const parsed = JSON.parse(storedSession) as StoredSession;
        setToken(parsed.token);
        setCurrentUser(parsed.user);
        await hydrateAfterAuth(parsed.token, parsed.user);
      } catch {
        setToken(null);
        setCurrentUser(null);
        setUsers([]);
        setFields([]);
        setDashboardSummary(emptySummary);
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setIsHydrated(true);
      }
    };

    void hydrate();
  }, []);

  // Login
  const login: AppContextValue["login"] = async (email, password) => {
    try {
      const auth = await fetchJson<BackendAuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const nextUser = mapUser(auth.user);
      setToken(auth.access_token);
      setCurrentUser(nextUser);
      persistSession(auth.access_token, nextUser);
      await hydrateAfterAuth(auth.access_token, nextUser);

      return { success: true, role: nextUser.role };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to login.",
      };
    }
  };

  const registerUser: AppContextValue["registerUser"] = async ({ name, email, password, role }) => {
    try {
      const auth = await fetchJson<BackendAuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const nextUser = mapUser(auth.user);
      setToken(auth.access_token);
      setCurrentUser(nextUser);
      persistSession(auth.access_token, nextUser);
      await hydrateAfterAuth(auth.access_token, nextUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to create account.",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setUsers([]);
    setFields([]);
    setDashboardSummary(emptySummary);
    persistSession(null, null);
  };

  const createField: AppContextValue["createField"] = async ({
    name,
    cropType,
    plantingDate,
    assignedAgentId,
  }) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      await fetchJson<BackendField>(
        "/fields",
        {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            crop_type: cropType.trim(),
            planting_date: plantingDate,
            current_stage: "Planted",
            assigned_agent_id: assignedAgentId ? Number(assignedAgentId) : null,
          }),
        },
        token
      );
      await Promise.all([hydrateFields(token), hydrateSummary(token)]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to create field.",
      };
    }
  };

  const assignField: AppContextValue["assignField"] = async (fieldId, agentId) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      await fetchJson<BackendField>(
        `/fields/${fieldId}/assign`,
        {
          method: "PATCH",
          body: JSON.stringify({
            assigned_agent_id: agentId ? Number(agentId) : null,
          }),
        },
        token
      );
      await Promise.all([hydrateFields(token), hydrateSummary(token)]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to assign field.",
      };
    }
  };

  const updateFieldProgress: AppContextValue["updateFieldProgress"] = async ({ fieldId, stage, note }) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      await fetchJson<BackendFieldUpdate>(
        `/fields/${fieldId}/updates`,
        {
          method: "POST",
          body: JSON.stringify({ stage, note: note.trim() }),
        },
        token
      );
      await Promise.all([hydrateFields(token), hydrateSummary(token)]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to submit field update.",
      };
    }
  };

  const value = useMemo<AppContextValue>(
    () => ({
      isHydrated,
      users,
      currentUser,
      fields,
      dashboardSummary,
      login,
      registerUser,
      logout,
      createField,
      assignField,
      updateFieldProgress,
      getFieldStatus: (field) => field.status,
    }),
    [isHydrated, users, currentUser, fields, dashboardSummary]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider.");
  }
  return context;
};
