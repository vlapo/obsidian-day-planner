import { get } from "svelte/store";

import { Tasks } from "../../../../types";
import { toMinutes } from "../../../../util/moment";
import { baseTask } from "../../test-utils";

import { baseTasks, dayKey, nextDayKey } from "./util/fixtures";
import { setUp_MULTIDAY } from "./util/setup";

describe("moving tasks between containers", () => {
  test("with no edit operation in progress, nothing happens on mouse move", () => {
    const { todayControls, moveCursorTo, displayedTasks } = setUp_MULTIDAY({
      tasks: baseTasks,
    });

    const initial = get(displayedTasks);

    todayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toEqual(initial);
  });

  test.todo("moving a task to day without a note");

  test("scheduling works between days", () => {
    const tasks: Tasks = {
      [dayKey]: {
        withTime: [],
        noTime: [baseTask],
      },
      [nextDayKey]: {
        withTime: [],
        noTime: [],
      },
    };

    const { todayControls, nextDayControls, moveCursorTo, displayedTasks } =
      setUp_MULTIDAY({
        tasks,
      });

    todayControls.handleGripMouseDown({} as MouseEvent, baseTask);
    nextDayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        noTime: [],
        withTime: [],
      },
      [nextDayKey]: {
        withTime: [{ startMinutes: toMinutes("01:00") }],
      },
    });
  });

  test("drag works between days", () => {
    const tasks: Tasks = {
      [dayKey]: {
        withTime: [
          baseTask,
          { ...baseTask, id: "2", startMinutes: toMinutes("01:00") },
        ],
        noTime: [],
      },
      [nextDayKey]: {
        withTime: [{ ...baseTask, id: "3", startMinutes: toMinutes("01:00") }],
        noTime: [],
      },
    };

    const { todayControls, nextDayControls, moveCursorTo, displayedTasks } =
      setUp_MULTIDAY({
        tasks,
      });

    todayControls.handleGripMouseDown({} as MouseEvent, baseTask);
    nextDayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        withTime: [{ id: "2", startMinutes: toMinutes("01:00") }],
      },
      [nextDayKey]: {
        withTime: [
          { startMinutes: toMinutes("01:00") },
          { id: "3", startMinutes: toMinutes("01:00") },
        ],
      },
    });
  });

  test("drag many works between days", () => {
    const tasks: Tasks = {
      [dayKey]: {
        withTime: [
          baseTask,
          { ...baseTask, id: "2", startMinutes: toMinutes("01:00") },
        ],
        noTime: [],
      },
      [nextDayKey]: {
        withTime: [{ ...baseTask, id: "3", startMinutes: toMinutes("01:00") }],
        noTime: [],
      },
    };

    const { todayControls, nextDayControls, moveCursorTo, displayedTasks } =
      setUp_MULTIDAY({
        tasks,
      });

    todayControls.handleGripMouseDown(
      { ctrlKey: true } as MouseEvent,
      baseTask,
    );
    nextDayControls.handleMouseEnter();
    moveCursorTo("01:00");

    expect(get(displayedTasks)).toMatchObject({
      [dayKey]: {
        withTime: [{ id: "2", startMinutes: toMinutes("01:00") }],
      },
      [nextDayKey]: {
        withTime: [
          { startMinutes: toMinutes("01:00") },
          { id: "3", startMinutes: toMinutes("02:00") },
        ],
      },
    });
  });
});
