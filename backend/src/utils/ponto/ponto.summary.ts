import { PointSummary, TimeEntryRecord } from "../../useCases/ponto/contracts/ponto.types";
import { getAvailableActions, getPointStatus } from "./ponto.Actions";
import { calculateWorkedMinutes, formatDay, formatDuration, formatTime, mapActionLabel } from "./ponto.formatter";

export function buildPointSummary(input: {
    employeeName: string;
    entries: TimeEntryRecord[];
    now?: Date;
}): PointSummary {
    const now = input.now ?? new Date();
    const actions = input.entries.map((entry) => entry.action);

    return {
        employeeName: input.employeeName,
        status: getPointStatus(actions),
        shiftLabel: "Jornada prevista: 08:00 - 17:00",
        workedTime: formatDuration(calculateWorkedMinutes(input.entries, now)),
        currentDay: formatDay(now),
        currentTime: formatTime(now),
        availableActions: getAvailableActions(actions),
        records: input.entries.map((entry) => {
            const mapped = mapActionLabel(entry.action);

            return {
                id: entry.id,
                label: mapped.label,
                timestamp: formatTime(entry.created_at),
                kind: mapped.kind,
            };
        }),
    };
}