// BS(AI) Group 1 weekly schedule. `subject` is the id in src/content/subjects.
export type Slot = { time: string; subject: string; room: string };

export const timetable: { day: string; slots: Slot[] }[] = [
  {
    day: 'Monday',
    slots: [
      { time: '08:00–08:50', subject: 'applied-physics', room: 'Examination Hall 3' },
      { time: '09:40–10:30', subject: 'calculus', room: 'Examination Hall 3' },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '08:50–09:40', subject: 'pakistan-studies', room: 'Examination Hall 3' },
      { time: '10:30–11:20', subject: 'calculus', room: 'Examination Hall 2' },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '08:50–09:40', subject: 'applied-physics', room: 'Examination Hall 2' },
      { time: '09:40–10:30', subject: 'calculus', room: 'Examination Hall 3' },
      { time: '10:30–11:20', subject: 'ideology-constitution', room: 'Weed Science Hall' },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { time: '08:00–08:50', subject: 'functional-english', room: 'Examination Hall 3' },
      { time: '08:50–09:40', subject: 'functional-english', room: 'Examination Hall 2' },
    ],
  },
  {
    day: 'Friday',
    slots: [
      { time: '08:50–09:40', subject: 'functional-english', room: 'Examination Hall 2' },
      { time: '09:40–10:30', subject: 'applied-physics', room: 'Examination Hall 1' },
      { time: '10:30–11:20', subject: 'pakistan-studies', room: 'Outreach Hall' },
      { time: '11:20–12:10', subject: 'ideology-constitution', room: 'Examination Hall 2' },
    ],
  },
];
