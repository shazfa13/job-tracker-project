import React, { useMemo, useState } from "react";

function parseDateString(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatMonthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function DeadlineCalendar({ jobs = [], darkMode = false }) {
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const totalDays = monthEnd.getDate();
  const startDayIndex = monthStart.getDay();
  const calendarCells = [];

  for (let index = 0; index < startDayIndex; index += 1) {
    calendarCells.push({ key: `empty-${index}`, empty: true });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    calendarCells.push({ key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, date, empty: false });
  }

  const deadlines = useMemo(() => {
    return jobs
      .map((job) => {
        const deadlineDate = parseDateString(job.deadline);
        return deadlineDate ? { ...job, deadlineDate } : null;
      })
      .filter(Boolean)
      .sort((firstJob, secondJob) => firstJob.deadlineDate - secondJob.deadlineDate);
  }, [jobs]);

  const monthDeadlines = deadlines.filter(
    (job) =>
      job.deadlineDate.getFullYear() === viewDate.getFullYear() &&
      job.deadlineDate.getMonth() === viewDate.getMonth()
  );

  const dueSoon = deadlines.filter((job) => {
    const difference = job.deadlineDate.getTime() - today.getTime();
    return difference >= 0 && difference <= 1000 * 60 * 60 * 24 * 14;
  });

  const cellBorderColor = darkMode ? "#4b5563" : "#e5e7eb";

  const calendarGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "10px"
  };

  const cellStyle = {
    minHeight: "110px",
    padding: "10px",
    borderRadius: "12px",
    border: `1px solid ${cellBorderColor}`,
    background: darkMode ? "#1f2937" : "#ffffff"
  };

  return (
    <section
      style={{
        margin: "0 24px 24px",
        padding: "24px",
        borderRadius: "16px",
        background: darkMode ? "#111827" : "#f8fafc",
        border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
        boxShadow: darkMode ? "0 16px 40px rgba(0,0,0,0.25)" : "0 16px 40px rgba(15, 23, 42, 0.06)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: darkMode ? "#9ca3af" : "#64748b" }}>
            Application Deadlines
          </p>
          <h2 style={{ margin: "8px 0 0", fontSize: "24px", fontWeight: 700, color: darkMode ? "#f3f4f6" : "#0f172a" }}>
            Deadline Calendar
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: `1px solid ${darkMode ? "#4b5563" : "#dbe2ea"}`,
              background: darkMode ? "#1f2937" : "#ffffff",
              color: darkMode ? "#f3f4f6" : "#0f172a",
              cursor: "pointer"
            }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer"
            }}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: `1px solid ${darkMode ? "#4b5563" : "#dbe2ea"}`,
              background: darkMode ? "#1f2937" : "#ffffff",
              color: darkMode ? "#f3f4f6" : "#0f172a",
              cursor: "pointer"
            }}
          >
            Next
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, 0.9fr)", gap: "20px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", color: darkMode ? "#f3f4f6" : "#0f172a" }}>
              {formatMonthLabel(viewDate)}
            </h3>
            <span style={{ fontSize: "13px", color: darkMode ? "#9ca3af" : "#64748b" }}>
              {monthDeadlines.length} deadline{monthDeadlines.length === 1 ? "" : "s"} this month
            </span>
          </div>

          <div style={calendarGridStyle}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayLabel) => (
              <div key={dayLabel} style={{ fontSize: "12px", fontWeight: 700, color: darkMode ? "#cbd5e1" : "#475569", padding: "0 4px" }}>
                {dayLabel}
              </div>
            ))}

            {calendarCells.map((cell) => {
              if (cell.empty) {
                return <div key={cell.key} style={{ ...cellStyle, opacity: 0.35, background: "transparent", borderStyle: "dashed" }} />;
              }

              const dayJobs = deadlines.filter((job) => isSameDay(job.deadlineDate, cell.date));
              const isToday = isSameDay(cell.date, today);

              return (
                <div
                  key={cell.key}
                  style={{
                    ...cellStyle,
                    borderColor: isToday ? "#3b82f6" : cellBorderColor,
                    boxShadow: isToday ? "0 0 0 1px rgba(59, 130, 246, 0.25)" : "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: darkMode ? "#f3f4f6" : "#0f172a" }}>
                      {cell.date.getDate()}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "999px", background: "#dbeafe", color: "#1d4ed8", fontWeight: 700 }}>
                        Today
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {dayJobs.length === 0 ? (
                      <span style={{ fontSize: "12px", color: darkMode ? "#6b7280" : "#94a3b8" }}>No deadline</span>
                    ) : (
                      dayJobs.slice(0, 3).map((job) => (
                        <div
                          key={job.id}
                          title={`${job.role} at ${job.company}`}
                          style={{
                            fontSize: "12px",
                            padding: "6px 8px",
                            borderRadius: "8px",
                            background: darkMode ? "rgba(59, 130, 246, 0.16)" : "#eff6ff",
                            color: darkMode ? "#bfdbfe" : "#1d4ed8",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {job.company} · {job.role}
                        </div>
                      ))
                    )}
                    {dayJobs.length > 3 && (
                      <span style={{ fontSize: "11px", color: darkMode ? "#9ca3af" : "#64748b" }}>
                        +{dayJobs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside
          style={{
            padding: "18px",
            borderRadius: "14px",
            background: darkMode ? "#1f2937" : "#ffffff",
            border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`
          }}
        >
          <h3 style={{ margin: "0 0 14px", fontSize: "18px", color: darkMode ? "#f3f4f6" : "#0f172a" }}>
            Upcoming Deadlines
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {dueSoon.length === 0 ? (
              <p style={{ margin: 0, color: darkMode ? "#9ca3af" : "#64748b", fontSize: "14px" }}>
                No deadlines in the next 14 days.
              </p>
            ) : (
              dueSoon.slice(0, 6).map((job) => {
                const daysLeft = Math.ceil((job.deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const accent = daysLeft < 0 ? "#ef4444" : daysLeft === 0 ? "#f59e0b" : "#10b981";

                return (
                  <div
                    key={job.id}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                      background: darkMode ? "#111827" : "#f8fafc"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "6px" }}>
                      <strong style={{ color: darkMode ? "#f3f4f6" : "#0f172a", fontSize: "14px" }}>
                        {job.company}
                      </strong>
                      <span style={{ color: accent, fontSize: "12px", fontWeight: 700 }}>
                        {daysLeft === 0 ? "Due today" : daysLeft < 0 ? `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} overdue` : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 6px", color: darkMode ? "#d1d5db" : "#334155", fontSize: "13px" }}>
                      {job.role}
                    </p>
                    <p style={{ margin: 0, color: darkMode ? "#9ca3af" : "#64748b", fontSize: "12px" }}>
                      {formatDayLabel(job.deadlineDate)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default DeadlineCalendar;
