import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Phone,
  PhoneCall,
  Search,
  TrendingUp,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CallStatus =
  | "Completed"
  | "No Answer"
  | "Busy"
  | "Failed"
  | "In Progress";

type CallOutcome =
  | "Interested"
  | "Maybe"
  | "Not Interested"
  | "Undetermined";

interface CandidateCall {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: CallStatus;
  duration: string;
  outcome: CallOutcome;
  calledAt: string;
  summary: string;
  transcript: string;
}

const mockCalls: CandidateCall[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Senior Software Engineer",
    phone: "+91 98765 43210",
    status: "Completed",
    duration: "04:32",
    outcome: "Interested",
    calledAt: "2 min ago",
    summary:
      "John has 5 years of backend engineering experience and is interested in discussing the opportunity. He is available for an interview next week.",
    transcript:
      "AI: Hi John, I'm calling regarding the Senior Software Engineer opportunity.\n\nJohn: Sure, I have a few minutes.\n\nAI: Are you currently open to new opportunities?\n\nJohn: Yes, definitely. I'm actively looking.\n\nAI: Would you be interested in discussing this role further?\n\nJohn: Yes, I'd be interested.",
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "Backend Engineer",
    phone: "+91 99887 66554",
    status: "Completed",
    duration: "06:18",
    outcome: "Maybe",
    calledAt: "5 min ago",
    summary:
      "Sarah is open to the opportunity but would like to understand the compensation range and remote-work policy before proceeding.",
    transcript:
      "AI: Hi Sarah, I'm calling about an engineering opportunity.\n\nSarah: Okay, what company is this for?\n\nAI: The position is for a Backend Engineer.\n\nSarah: I'm potentially interested. What's the compensation range?",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Staff Engineer",
    phone: "+91 91234 56789",
    status: "No Answer",
    duration: "--",
    outcome: "Undetermined",
    calledAt: "8 min ago",
    summary: "",
    transcript: "",
  },
  {
    id: "4",
    name: "Alex Brown",
    role: "Software Engineer",
    phone: "+91 90011 22334",
    status: "Failed",
    duration: "--",
    outcome: "Undetermined",
    calledAt: "10 min ago",
    summary: "",
    transcript: "",
  },
  {
    id: "5",
    name: "Emily Davis",
    role: "Frontend Engineer",
    phone: "+91 88877 66554",
    status: "Completed",
    duration: "03:42",
    outcome: "Not Interested",
    calledAt: "14 min ago",
    summary:
      "Emily is not currently looking for a new opportunity and requested not to be contacted again.",
    transcript:
      "AI: Hi Emily, I'm calling regarding a Frontend Engineer opportunity.\n\nEmily: Thanks, but I'm not looking for a change right now.",
  },
  {
    id: "6",
    name: "David Wilson",
    role: "Platform Engineer",
    phone: "+91 87766 55443",
    status: "Completed",
    duration: "05:12",
    outcome: "Interested",
    calledAt: "18 min ago",
    summary:
      "David showed strong interest in the role and has relevant platform engineering experience.",
    transcript:
      "AI: Are you currently exploring new opportunities?\n\nDavid: Yes.\n\nAI: Would you be interested in a platform engineering role?\n\nDavid: Absolutely.",
  },
  {
    id: "7",
    name: "Rachel Thomas",
    role: "Engineering Manager",
    phone: "+91 76655 44332",
    status: "Busy",
    duration: "--",
    outcome: "Undetermined",
    calledAt: "22 min ago",
    summary: "",
    transcript: "",
  },
  {
    id: "8",
    name: "Daniel Martin",
    role: "Backend Engineer",
    phone: "+91 75544 33221",
    status: "Completed",
    duration: "04:08",
    outcome: "Interested",
    calledAt: "27 min ago",
    summary:
      "Daniel is interested and requested more information about the team and responsibilities.",
    transcript:
      "AI: Hi Daniel, I'm calling about a Backend Engineer role.\n\nDaniel: Yes, I'd like to hear more about it.\n\nAI: Would you be open to an interview?\n\nDaniel: Sure.",
  },
];

const activityData = [
  { time: "9 AM", initiated: 8, answered: 6, completed: 5 },
  { time: "10 AM", initiated: 14, answered: 10, completed: 8 },
  { time: "11 AM", initiated: 21, answered: 15, completed: 13 },
  { time: "12 PM", initiated: 17, answered: 12, completed: 10 },
  { time: "1 PM", initiated: 25, answered: 19, completed: 16 },
  { time: "2 PM", initiated: 19, answered: 14, completed: 12 },
  { time: "3 PM", initiated: 23, answered: 17, completed: 15 },
  { time: "4 PM", initiated: 16, answered: 12, completed: 10 },
];

const statusData = [
  { label: "Completed", value: 61 },
  { label: "No Answer", value: 14 },
  { label: "Busy", value: 8 },
  { label: "Failed", value: 10 },
  { label: "In Progress", value: 5 },
];

const outcomeData = [
  { label: "Interested", value: 24 },
  { label: "Maybe", value: 18 },
  { label: "Not Interested", value: 19 },
];

const statusStyles: Record<CallStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  "No Answer": "bg-amber-50 text-amber-700",
  Busy: "bg-orange-50 text-orange-700",
  Failed: "bg-red-50 text-red-700",
  "In Progress": "bg-blue-50 text-blue-700",
};

const outcomeStyles: Record<CallOutcome, string> = {
  Interested: "text-emerald-700 bg-emerald-50",
  Maybe: "text-amber-700 bg-amber-50",
  "Not Interested": "text-red-700 bg-red-50",
  Undetermined: "text-gray-500 bg-gray-100",
};

function StatusBadge({ status }: { status: CallStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "Completed"
            ? "bg-emerald-500"
            : status === "Failed"
              ? "bg-red-500"
              : status === "In Progress"
                ? "bg-blue-500"
                : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${outcomeStyles[outcome]}`}
    >
      {outcome}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>

        <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function CallDashboard() {
  const [selectedCall, setSelectedCall] = useState<CandidateCall | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CallStatus>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCalls = useMemo(() => {
    return mockCalls.filter((call) => {
      const matchesSearch =
        call.name.toLowerCase().includes(search.toLowerCase()) ||
        call.role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || call.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                <ArrowLeft size={20} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">
                    Forward Deployed Engineer
                  </h1>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Active
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <span>Acme Corp</span>
                  <span>•</span>
                  <span>124 candidates</span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800">
              <PhoneCall size={17} />
              Start Calls
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-7">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <StatCard
            title="Candidates"
            value="124"
            subtitle="Total candidates"
            icon={<UserCheck size={19} />}
          />

          <StatCard
            title="Initiated"
            value="98"
            subtitle="79% of candidates"
            icon={<PhoneCall size={19} />}
          />

          <StatCard
            title="Answered"
            value="72"
            subtitle="73% answer rate"
            icon={<Phone size={19} />}
          />

          <StatCard
            title="Completed"
            value="61"
            subtitle="85% completion rate"
            icon={<CheckCircle2 size={19} />}
          />

          <StatCard
            title="Interested"
            value="24"
            subtitle="39% of completed"
            icon={<TrendingUp size={19} />}
          />

          <StatCard
            title="Avg. Duration"
            value="04:18"
            subtitle="Per completed call"
            icon={<Clock3 size={19} />}
          />
        </div>

        {/* Analytics */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Call activity</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Calls throughout the day
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
                Today
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="initiated"
                    stroke="#111827"
                    fill="#f3f4f6"
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="answered"
                    stroke="#6b7280"
                    fill="#f9fafb"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex gap-5 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-900" />
                Initiated
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-500" />
                Answered
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="font-semibold text-gray-900">Call status</h2>
              <p className="mt-1 text-sm text-gray-500">
                Current campaign status
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {statusData.map((item) => {
                const percentage = Math.round((item.value / 98) * 100);

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-800"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Answer rate</span>
                <span className="text-lg font-semibold">73%</span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp size={13} />
                8.2% vs previous campaign
              </div>
            </div>
          </div>
        </div>

        {/* Outcome section */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Candidate outcome</h2>
              <p className="mt-1 text-sm text-gray-500">
                Interest generated from completed calls
              </p>
            </div>

            <BarChart3 size={20} className="text-gray-400" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {outcomeData.map((item) => {
              const percentage = Math.round((item.value / 61) * 100);

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {item.label}
                    </span>
                    <span className="text-xl font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gray-800"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {percentage}% of completed calls
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calls table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Candidate calls</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review calls and candidate responses
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search candidate..."
                    className="h-9 w-56 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Filter
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 flex gap-2">
                {[
                  "All",
                  "Completed",
                  "No Answer",
                  "Busy",
                  "Failed",
                  "In Progress",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(status as "All" | CallStatus)
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      statusFilter === status
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Candidate
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Duration
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Outcome
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Called
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="cursor-pointer border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                          {call.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {call.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {call.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={call.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {call.duration}
                    </td>

                    <td className="px-5 py-4">
                      <OutcomeBadge outcome={call.outcome} />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {call.calledAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCalls.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500">
                  No candidates found.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing {filteredCalls.length} of 124 candidates
            </p>

            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500">
                Previous
              </button>
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Candidate drawer */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setSelectedCall(null)}
          />

          <aside className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl">
            <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700">
                    {selectedCall.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedCall.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedCall.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCall(null)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Call info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedCall.status} />
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="mt-2 text-sm font-medium">
                    {selectedCall.duration}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Outcome</p>
                  <div className="mt-2">
                    <OutcomeBadge outcome={selectedCall.outcome} />
                  </div>
                </div>
              </div>

              {/* Candidate */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900">
                  Candidate
                </h3>

                <div className="mt-3 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={15} />
                    {selectedCall.phone}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={15} />
                    {selectedCall.calledAt}
                  </div>
                </div>
              </section>

              {/* Summary */}
              {selectedCall.summary && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Call summary
                  </h3>

                  <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                    {selectedCall.summary}
                  </div>
                </section>
              )}

              {/* Transcript */}
              {selectedCall.transcript && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Transcript
                  </h3>

                  <div className="mt-3 whitespace-pre-line rounded-lg border border-gray-200 bg-white p-4 text-sm leading-7 text-gray-600">
                    {selectedCall.transcript}
                  </div>
                </section>
              )}

              {!selectedCall.summary && !selectedCall.transcript && (
                <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center">
                  {selectedCall.status === "Failed" ? (
                    <XCircle className="mx-auto text-red-400" size={28} />
                  ) : (
                    <Clock3 className="mx-auto text-gray-400" size={28} />
                  )}

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No call details available
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Details will appear once the webhook is processed.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}