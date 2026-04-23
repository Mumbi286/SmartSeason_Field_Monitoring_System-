import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router";
import { useAppContext } from "~/context/AppContext";
import type { FieldStage, FieldStatus } from "~/context/AppContext";

const stageOptions: FieldStage[] = ["Planted", "Growing", "Ready", "Harvested"];

const statusClassMap: Record<FieldStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  "At Risk": "bg-amber-500/15 text-amber-300 border-amber-500/40",
  Completed: "bg-sky-500/15 text-sky-300 border-sky-500/40",
};

const DashboardPage = () => {
  const {
    currentUser,
    isHydrated,
    users,
    fields,
    createField,
    assignField,
    updateFieldProgress,
    getFieldStatus,
  } = useAppContext();

  const agents = useMemo(() => users.filter((user) => user.role === "agent"), [users]);
  // Role-based visibility:
  // - Admin sees all fields
  // - Field Agent sees only fields assigned to them
  const visibleFields = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") return fields;
    return fields.filter((field) => field.assignedAgentId === currentUser.id);
  }, [fields, currentUser]);

  const [fieldName, setFieldName] = useState("");
  const [cropType, setCropType] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [assignedAgentId, setAssignedAgentId] = useState("");
  const [agentStageByField, setAgentStageByField] = useState<Record<string, FieldStage>>({});
  const [agentNoteByField, setAgentNoteByField] = useState<Record<string, string>>({});

  // Shared summary cards for both roles
  const totals = useMemo(() => {
    const initial = { total: visibleFields.length, active: 0, atRisk: 0, completed: 0 };
    return visibleFields.reduce((acc, field) => {
      const status = getFieldStatus(field);
      if (status === "Active") acc.active += 1;
      if (status === "At Risk") acc.atRisk += 1;
      if (status === "Completed") acc.completed += 1;
      return acc;
    }, initial);
  }, [visibleFields, getFieldStatus]);

  if (!isHydrated) {
    return <section className="text-slate-200">Loading dashboard...</section>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateField = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createField({
      name: fieldName,
      cropType,
      plantingDate,
      assignedAgentId: assignedAgentId || undefined,
    });
    setFieldName("");
    setCropType("");
    setPlantingDate("");
    setAssignedAgentId("");
  };

  const handleFieldUpdate = (event: FormEvent<HTMLFormElement>, fieldId: string) => {
    event.preventDefault();
    updateFieldProgress({
      fieldId,
      stage: agentStageByField[fieldId] ?? "Growing",
      note: agentNoteByField[fieldId] ?? "",
    });
    setAgentNoteByField((prev) => ({ ...prev, [fieldId]: "" }));
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-300">Dashboard</h1>
          <p className="text-slate-300 text-sm">
            {currentUser.role === "admin"
              ? "Overview of all fields and assignments."
              : "Your assigned fields and updates."}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-slate-900 border border-slate-700">
          {currentUser.role}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-xs uppercase text-slate-400">Total Fields</p>
          <p className="text-2xl font-bold text-slate-100">{totals.total}</p>
        </article>
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-xs uppercase text-slate-400">Active</p>
          <p className="text-2xl font-bold text-emerald-300">{totals.active}</p>
        </article>
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-xs uppercase text-slate-400">At Risk</p>
          <p className="text-2xl font-bold text-amber-300">{totals.atRisk}</p>
        </article>
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-xs uppercase text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-sky-300">{totals.completed}</p>
        </article>
      </div>

      {currentUser.role === "admin" && (
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-300 mb-3">Create Field</h2>
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleCreateField}>
            <label className="space-y-1 text-sm">
              <span>Field Name</span>
              <input
                required
                value={fieldName}
                onChange={(event) => setFieldName(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Crop Type</span>
              <input
                required
                value={cropType}
                onChange={(event) => setCropType(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Planting Date</span>
              <input
                required
                type="date"
                value={plantingDate}
                onChange={(event) => setPlantingDate(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Assign Agent</span>
              <select
                value={assignedAgentId}
                onChange={(event) => setAssignedAgentId(event.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="md:col-span-2 lg:col-span-4 bg-green-600 hover:bg-green-700 rounded px-4 py-2"
            >
              Add Field
            </button>
          </form>
        </article>
      )}

      <article className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-300 mb-4">Fields</h2>
        <div className="space-y-4">
          {visibleFields.length === 0 && (
            <p className="text-slate-400 text-sm">No fields available for this view.</p>
          )}
          {visibleFields.map((field) => {
            const status = getFieldStatus(field);
            const assignedAgent = users.find((user) => user.id === field.assignedAgentId);
            const latestUpdate = field.updates[0];

            return (
              <article
                key={field.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{field.name}</h3>
                    <p className="text-sm text-slate-300">
                      {field.cropType} - Planted: {field.plantingDate}
                    </p>
                  </div>
                  <span className={`text-xs border rounded-full px-3 py-1 ${statusClassMap[status]}`}>
                    {status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                  <p>Stage: {field.currentStage}</p>
                  <p>Agent: {assignedAgent?.name ?? "Unassigned"}</p>
                </div>

                {/* Admin-only action: assign or reassign the field to an agent. */}
                {currentUser.role === "admin" && (
                  <label className="block text-sm space-y-1">
                    <span>Assign/Reassign Agent</span>
                    <select
                      value={field.assignedAgentId ?? ""}
                      onChange={(event) => assignField(field.id, event.target.value || undefined)}
                      className="w-full md:w-80 rounded border border-slate-700 bg-slate-900 px-3 py-2"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {currentUser.role === "agent" && (
                  <form className="grid gap-3 md:grid-cols-3" onSubmit={(event) => handleFieldUpdate(event, field.id)}>
                    <label className="space-y-1 text-sm">
                      <span>New Stage</span>
                      <select
                        value={agentStageByField[field.id] ?? field.currentStage}
                        onChange={(event) =>
                          setAgentStageByField((prev) => ({
                            ...prev,
                            [field.id]: event.target.value as FieldStage,
                          }))
                        }
                        className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                      >
                        {stageOptions.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1 text-sm md:col-span-2">
                      <span>Observation Note</span>
                      <input
                        required
                        value={agentNoteByField[field.id] ?? ""}
                        onChange={(event) =>
                          setAgentNoteByField((prev) => ({
                            ...prev,
                            [field.id]: event.target.value,
                          }))
                        }
                        className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
                      />
                    </label>
                    <button
                      type="submit"
                      className="md:col-span-3 bg-green-600 hover:bg-green-700 rounded px-4 py-2"
                    >
                      Save Update
                    </button>
                  </form>
                )}

                {latestUpdate ? (
                  <p className="text-sm text-slate-400">
                    Latest update ({latestUpdate.createdAt}): {latestUpdate.note}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">No updates recorded yet.</p>
                )}
              </article>
            );
          })}
        </div>
      </article>
    </section>
  );
};

export default DashboardPage;
