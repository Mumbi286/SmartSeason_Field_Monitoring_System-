import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "admin" | "agent";
export type FieldStage = "Planted" | "Growing" | "Ready" | "Harvested";
export type FieldStatus = "Active" | "At Risk" | "Completed";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type FieldUpdate = {
  id: string;
  fieldId: string;
  agentId: string;
  stage: FieldStage;
  note: string;
  createdAt: string;
};

export type FieldRecord = {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  currentStage: FieldStage;
  assignedAgentId?: string;
  updates: FieldUpdate[];
};

type AppContextValue = {
  isHydrated: boolean;
  users: AppUser[];
  currentUser: AppUser | null;
  fields: FieldRecord[];
  login: (email: string, password: string) => boolean;
  registerUser: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => { success: boolean; message?: string };
  logout: () => void;
  createField: (payload: {
    name: string;
    cropType: string;
    plantingDate: string;
    assignedAgentId?: string;
  }) => void;
  assignField: (fieldId: string, agentId?: string) => void;
  updateFieldProgress: (payload: {
    fieldId: string;
    stage: FieldStage;
    note: string;
  }) => void;
  getFieldStatus: (field: FieldRecord) => FieldStatus;
};

const USERS_STORAGE_KEY = "smartseason.users";
const SESSION_STORAGE_KEY = "smartseason.session";
const FIELDS_STORAGE_KEY = "smartseason.fields";

const initialUsers: AppUser[] = [
  {
    id: "u_admin",
    name: "Grace Coordinator",
    email: "admin@smartseason.test",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u_agent_1",
    name: "Daniel Agent",
    email: "agent1@smartseason.test",
    password: "agent123",
    role: "agent",
  },
  {
    id: "u_agent_2",
    name: "Amina Agent",
    email: "agent2@smartseason.test",
    password: "agent123",
    role: "agent",
  },
];

const initialFields: FieldRecord[] = [
  {
    id: "f_001",
    name: "Kakamega Farm",
    cropType: "Maize",
    plantingDate: "2026-03-05",
    currentStage: "Growing",
    assignedAgentId: "u_agent_1",
    updates: [
      {
        id: "fu_001",
        fieldId: "f_001",
        agentId: "u_agent_1",
        stage: "Growing",
        note: "Healthy leaf color and steady early growth.",
        createdAt: "2026-03-22",
      },
    ],
  },
  {
    id: "f_002",
    name: "Thika Greens Farm",
    cropType: "Beans",
    plantingDate: "2026-02-25",
    currentStage: "Ready",
    assignedAgentId: "u_agent_2",
    updates: [
      {
        id: "fu_002",
        fieldId: "f_002",
        agentId: "u_agent_2",
        stage: "Ready",
        note: "Pods filling well. Plan harvest within a week.",
        createdAt: "2026-04-14",
      },
    ],
  },
  {
    id: "f_003",
    name: "Makueni Ranch",
    cropType: "Wheat",
    plantingDate: "2026-01-10",
    currentStage: "Harvested",
    assignedAgentId: "u_agent_1",
    updates: [
      {
        id: "fu_003",
        fieldId: "f_003",
        agentId: "u_agent_1",
        stage: "Harvested",
        note: "Harvest completed with expected output.",
        createdAt: "2026-03-28",
      },
    ],
  },
];

const AppContext = createContext<AppContextValue | null>(null);

const dateDiffInDays = (fromDate: string, toDate: Date) => {
  const start = new Date(fromDate);
  const diffMs = toDate.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const computeFieldStatus = (field: FieldRecord): FieldStatus => {
  if (field.currentStage === "Harvested") {
    return "Completed";
  }

  if (!field.assignedAgentId) {
    return "At Risk";
  }

  const now = new Date();
  const latestUpdate = [...field.updates].sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  )[0];
  const daysSinceUpdate = latestUpdate
    ? dateDiffInDays(latestUpdate.createdAt, now)
    : dateDiffInDays(field.plantingDate, now);
  const daysSincePlanting = dateDiffInDays(field.plantingDate, now);

  if (daysSinceUpdate > 14 || (field.currentStage === "Planted" && daysSincePlanting > 21)) {
    return "At Risk";
  }

  return "Active";
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [fields, setFields] = useState<FieldRecord[]>(initialFields);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    const storedFields = window.localStorage.getItem(FIELDS_STORAGE_KEY);
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    const parsedUsers = storedUsers ? (JSON.parse(storedUsers) as AppUser[]) : initialUsers;
    const parsedFields = storedFields
      ? (JSON.parse(storedFields) as FieldRecord[])
      : initialFields;
    const sessionEmail = storedSession ? (JSON.parse(storedSession) as string) : null;

    setUsers(parsedUsers);
    setFields(parsedFields);
    if (sessionEmail) {
      const sessionUser = parsedUsers.find((user) => user.email === sessionEmail) ?? null;
      setCurrentUser(sessionUser);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(fields));
  }, [fields, isHydrated]);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === password
    );

    if (!user) {
      return false;
    }

    setCurrentUser(user);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user.email));
    }
    return true;
  };

  const registerUser: AppContextValue["registerUser"] = ({
    name,
    email,
    password,
    role,
  }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = users.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser: AppUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser.email));
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const createField: AppContextValue["createField"] = ({
    name,
    cropType,
    plantingDate,
    assignedAgentId,
  }) => {
    setFields((prev) => [
      ...prev,
      {
        id: `f_${Date.now()}`,
        name: name.trim(),
        cropType: cropType.trim(),
        plantingDate,
        currentStage: "Planted",
        assignedAgentId: assignedAgentId || undefined,
        updates: [],
      },
    ]);
  };

  const assignField: AppContextValue["assignField"] = (fieldId, agentId) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, assignedAgentId: agentId || undefined } : field
      )
    );
  };

  const updateFieldProgress: AppContextValue["updateFieldProgress"] = ({
    fieldId,
    stage,
    note,
  }) => {
    if (!currentUser || currentUser.role !== "agent") return;

    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId || field.assignedAgentId !== currentUser.id) {
          return field;
        }

        const update: FieldUpdate = {
          id: `fu_${Date.now()}`,
          fieldId,
          agentId: currentUser.id,
          stage,
          note: note.trim(),
          createdAt: new Date().toISOString().slice(0, 10),
        };

        return {
          ...field,
          currentStage: stage,
          updates: [update, ...field.updates],
        };
      })
    );
  };

  const value = useMemo<AppContextValue>(
    () => ({
      isHydrated,
      users,
      currentUser,
      fields,
      login,
      registerUser,
      logout,
      createField,
      assignField,
      updateFieldProgress,
      getFieldStatus: computeFieldStatus,
    }),
    [isHydrated, users, currentUser, fields]
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
