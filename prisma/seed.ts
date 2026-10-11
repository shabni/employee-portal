import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
const demoPassword = 'PortalDemo2026!';

type SeedPerson = {
  key: string;
  firstName: string;
  lastName: string;
  username: string;
  title: string;
  roleTitle: string;
  leadKey?: string;
};

const roles = [
  { roleId: 'seed-role-developer', title: 'Developer', scale: 1, permissions: 'useTasks,submitReports,manageAttendance' },
  { roleId: 'seed-role-qa', title: 'QA', scale: 1, permissions: 'useTasks,submitReports,manageAttendance' },
  { roleId: 'seed-role-team-lead', title: 'Team Lead', scale: 2, permissions: 'useTasks,submitReports,manageAttendance,viewTeam,viewReports' },
  { roleId: 'seed-role-manager', title: 'Manager', scale: 3, permissions: 'useTasks,submitReports,manageAttendance,viewTeam,viewReports,manageEmployees' },
  { roleId: 'seed-role-director', title: 'Director', scale: 4, permissions: 'useTasks,submitReports,manageAttendance,viewTeam,viewReports,manageEmployees,manageRoles' },
  { roleId: 'seed-role-executive', title: 'Executive', scale: 5, permissions: 'useTasks,submitReports,manageAttendance,viewTeam,viewReports,manageEmployees,manageRoles,manageTasks' },
];

const people: SeedPerson[] = [
  { key: 'executive', firstName: 'Avery', lastName: 'Morgan', username: 'avery.executive', title: 'Executive', roleTitle: 'Executive' },
  { key: 'director', firstName: 'Jordan', lastName: 'Lee', username: 'jordan.director', title: 'Director', roleTitle: 'Director', leadKey: 'executive' },
  { key: 'manager1', firstName: 'Taylor', lastName: 'Reed', username: 'taylor.manager1', title: 'Engineering Manager', roleTitle: 'Manager', leadKey: 'director' },
  { key: 'manager2', firstName: 'Morgan', lastName: 'Diaz', username: 'morgan.manager2', title: 'Quality Manager', roleTitle: 'Manager', leadKey: 'director' },
  { key: 'lead1', firstName: 'Casey', lastName: 'Nguyen', username: 'casey.nguyen', title: 'Team Lead', roleTitle: 'Team Lead', leadKey: 'manager1' },
  { key: 'lead2', firstName: 'Riley', lastName: 'Patel', username: 'riley.patel', title: 'Team Lead', roleTitle: 'Team Lead', leadKey: 'manager1' },
  { key: 'lead3', firstName: 'Quinn', lastName: 'Brooks', username: 'quinn.brooks', title: 'Team Lead', roleTitle: 'Team Lead', leadKey: 'manager2' },
];

for (let pod = 1; pod <= 3; pod++) {
  const leadKey = `lead${pod}`;
  for (let dev = 1; dev <= 3; dev++) {
    const developers = [
      [['Sam', 'Rivera'], ['Alex', 'Kim'], ['Jamie', 'Turner']],
      [['Drew', 'Foster'], ['Taylor', 'Wu'], ['Reese', 'Carter']],
      [['Jordan', 'Hayes'], ['Finley', 'Scott'], ['Peyton', 'Green']],
    ];
    const [firstName, lastName] = developers[pod - 1][dev - 1];
    people.push({ key: `pod${pod}-dev${dev}`, firstName, lastName, username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.p${pod}`, title: 'Software Developer', roleTitle: 'Developer', leadKey });
  }
  for (let qa = 1; qa <= 2; qa++) {
    const testers = [
      [['Robin', 'Chen'], ['Cameron', 'Price']],
      [['Blair', 'Adams'], ['Dakota', 'Cruz']],
      [['Skyler', 'Ross'], ['Emerson', 'Ward']],
    ];
    const [firstName, lastName] = testers[pod - 1][qa - 1];
    people.push({ key: `pod${pod}-qa${qa}`, firstName, lastName, username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.p${pod}`, title: 'Quality Analyst', roleTitle: 'QA', leadKey });
  }
}

const tasks = [
  'Sprint planning and refinement',
  'Employee portal feature delivery',
  'Quality assurance and regression',
  'Production operations and monitoring',
  'Documentation and process updates',
  'Team coordination and delivery review',
];

function epochSeconds(date: Date): bigint {
  return BigInt(Math.floor(date.getTime() / 1000));
}

function officeTime(day: Date, hour: number, minute: number): bigint {
  const targetAsUtc = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, minute);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date(targetAsUtc));
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  const displayedAsUtc = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
  const offset = displayedAsUtc - targetAsUtc;
  return BigInt(Math.floor((targetAsUtc - offset) / 1000));
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function between(seed: string, min: number, max: number): number {
  return min + (stableHash(seed) % (max - min + 1));
}

function workFor(role: string, seed: string): [string, string] {
  const pools: Record<string, string[]> = {
    Developer: [tasks[1], tasks[4], tasks[3]],
    QA: [tasks[2], tasks[1], tasks[4]],
    'Team Lead': [tasks[0], tasks[5], tasks[1]],
    Manager: [tasks[0], tasks[5], tasks[3]],
    Director: [tasks[5], tasks[0], tasks[3]],
    Executive: [tasks[5], tasks[3], tasks[0]],
  };
  const pool = pools[role] ?? tasks;
  const firstIndex = stableHash(`${seed}-first`) % pool.length;
  let secondIndex = stableHash(`${seed}-second`) % pool.length;
  if (secondIndex === firstIndex) secondIndex = (secondIndex + 1) % pool.length;
  return [pool[firstIndex], pool[secondIndex]];
}

async function main(): Promise<void> {
  const roleIds = new Map<string, string>();
  for (const role of roles) {
    const saved = await prisma.roles.upsert({
      where: { title: role.title },
      create: { ...role, createdAt: nowSeconds, updatedAt: nowSeconds, isDeleted: false },
      update: { scale: role.scale, permissions: role.permissions, isDeleted: false, updatedAt: nowSeconds },
      select: { roleId: true },
    });
    roleIds.set(role.title, saved.roleId);
  }

  const userIds = new Map<string, string>();
  for (let index = 0; index < people.length; index++) {
    const person = people[index];
    const roleId = roleIds.get(person.roleTitle);
    if (!roleId) throw new Error(`Missing role ${person.roleTitle}`);
    const teamLeadId = person.leadKey ? userIds.get(person.leadKey) : null;
    if (person.leadKey && !teamLeadId) throw new Error(`Seed lead ${person.leadKey} must be created before ${person.username}`);
    const user = await prisma.users.upsert({
      where: { userId: `seed-user-${person.key}` },
      create: {
        userId: `seed-user-${person.key}`, fName: person.firstName, lName: person.lastName,
        userName: person.username, password: demoPassword, fatherName: 'Seed Workspace',
        joiningDate: officeTime(new Date(Date.UTC(2021 + index % 5, 0, 1)), 0, 0), nic: `${String(100 + index)}-${String(23 + index).padStart(2, '0')}-${String(8100 + index)}`,
        roleId, emailOffice: `${person.username}@example.test`, address: 'Demo workspace',
        phone: 5550100 + index, designation: person.title, teamLeadId,
        isLoggedIn: false, isCheckedIn: false, isDeleted: false, createdAt: nowSeconds, updatedAt: nowSeconds,
      },
      update: {
        fName: person.firstName, lName: person.lastName, userName: person.username, password: demoPassword,
        roleId, teamLeadId, designation: person.title, emailOffice: `${person.username}@example.test`,
        joiningDate: officeTime(new Date(Date.UTC(2021 + index % 5, 0, 1)), 0, 0),
        phone: 5550100 + index, nic: `${String(100 + index)}-${String(23 + index).padStart(2, '0')}-${String(8100 + index)}`,
        isLoggedIn: false, isCheckedIn: false, isDeleted: false, updatedAt: nowSeconds,
      },
      select: { userId: true },
    });
    userIds.set(person.key, user.userId);
    await prisma.session.deleteMany({ where: { userId: user.userId } });
  }

  const taskIds = new Map<string, string>();
  for (const [index, title] of tasks.entries()) {
    const saved = await prisma.tasks.upsert({
      where: { title },
      create: { taskId: `seed-task-${index + 1}`, title, createdAt: nowSeconds, updatedAt: nowSeconds, isDeleted: false },
      update: { isDeleted: false, updatedAt: nowSeconds },
      select: { taskId: true },
    });
    taskIds.set(title, saved.taskId);
  }

  // Seed the last complete calendar month; only Monday through Friday are workdays.
  const today = new Date();
  const firstDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
  const endDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  let attendanceCount = 0;
  let taskTrackCount = 0;
  let reportCount = 0;
  for (const day = new Date(firstDay); day < endDay; day.setUTCDate(day.getUTCDate() + 1)) {
    const weekday = day.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const dayStamp = officeTime(day, 0, 0);
    const dayKey = day.toISOString().slice(0, 10);
    for (const [personIndex, person] of people.entries()) {
      const userId = userIds.get(person.key)!;
      const arrivalRoll = stableHash(`${person.key}-${dayKey}-arrival`) % 100;
      const arrivalOffset = arrivalRoll < 4
        ? between(`${person.key}-${dayKey}-late-arrival`, 75, 105)
        : arrivalRoll < 15
          ? between(`${person.key}-${dayKey}-arrival`, 25, 55)
          : between(`${person.key}-${dayKey}-arrival`, -25, 25);
      const checkIn = officeTime(day, 8, 30 + arrivalOffset);
      const fridayEarlyFinish = weekday === 5 && stableHash(`${person.key}-${dayKey}-friday`) % 5 === 0;
      const departureOffset = fridayEarlyFinish
        ? between(`${person.key}-${dayKey}-early-finish`, -80, -35)
        : between(`${person.key}-${dayKey}-departure`, -20, 85);
      const checkOut = officeTime(day, 17, departureOffset);
      await prisma.attendence.upsert({
        where: { attendenceId: `seed-att-${person.key}-${dayKey}` },
        create: {
          attendenceId: `seed-att-${person.key}-${dayKey}`, attendenceDate: dayStamp,
          checkInTime: checkIn, checkOutTime: checkOut, userId,
          createdAt: dayStamp, updatedAt: dayStamp, isDeleted: false,
        },
        update: { attendenceDate: dayStamp, checkInTime: checkIn, checkOutTime: checkOut, userId, isDeleted: false, updatedAt: dayStamp },
      });
      attendanceCount++;

      const assignedTasks = workFor(person.roleTitle, `${person.key}-${dayKey}`);
      const checkInNumber = Number(checkIn);
      const checkOutNumber = Number(checkOut);
      const firstStart = checkInNumber + between(`${person.key}-${dayKey}-morning-start`, 15, 55) * 60;
      const firstFinish = firstStart + between(`${person.key}-${dayKey}-morning-duration`, 90, 185) * 60;
      const secondStart = firstFinish + between(`${person.key}-${dayKey}-lunch`, 40, 75) * 60;
      const secondFinish = Math.min(
        secondStart + between(`${person.key}-${dayKey}-afternoon-duration`, 100, 200) * 60,
        checkOutNumber - between(`${person.key}-${dayKey}-wrap-up`, 10, 25) * 60,
      );
      for (let slot = 0; slot < assignedTasks.length; slot++) {
        const start = BigInt(slot === 0 ? firstStart : secondStart);
        const finish = BigInt(slot === 0 ? firstFinish : secondFinish);
        const taskId = taskIds.get(assignedTasks[slot])!;
        const trackId = `seed-track-${person.key}-${dayKey}-${slot + 1}`;
        await prisma.taskTracks.upsert({
          where: { taskTrackId: trackId },
          create: {
            taskTrackId: trackId, startDate: start, endDate: finish,
            duration: finish - start, isActive: false, userId, taskId,
            createdAt: start, updatedAt: finish, isDeleted: false,
          },
          update: {
            startDate: start, endDate: finish, duration: finish - start,
            isActive: false, userId, taskId, isDeleted: false, updatedAt: finish,
          },
        });
        taskTrackCount++;
      }

      const reportId = `seed-report-${person.key}-${dayKey}`;
      const reportTime = BigInt(checkOutNumber - between(`${person.key}-${dayKey}-report`, 10, 30) * 60);
      const reportVariants = [
        `Completed ${assignedTasks[0].toLowerCase()} and moved ${assignedTasks[1].toLowerCase()} forward. I shared the remaining follow-ups with the team.`,
        `Focused on ${assignedTasks[0].toLowerCase()} today, then worked through ${assignedTasks[1].toLowerCase()}. No blockers are carrying into tomorrow.`,
        `Made progress on ${assignedTasks[0].toLowerCase()} and ${assignedTasks[1].toLowerCase()}. I reviewed the open items with my team and noted next steps.`,
      ];
      const description = reportVariants[stableHash(`${person.key}-${dayKey}-report-text`) % reportVariants.length];
      await prisma.reports.upsert({
        where: { reportId },
        create: {
          reportId, reportDate: reportTime,
          description,
          userId, createdAt: dayStamp, updatedAt: reportTime, isDeleted: false,
        },
        update: {
          reportDate: reportTime, userId, isDeleted: false,
          description,
          updatedAt: reportTime,
        },
      });
      reportCount++;
    }
  }

  console.log(`Seeded ${people.length} employees, ${roles.length} roles, ${tasks.length} tasks.`);
  console.log(`Seeded ${attendanceCount} working-day attendance records, ${taskTrackCount} task tracks, and ${reportCount} daily reports for ${firstDay.toISOString().slice(0, 7)}.`);
  console.log(`Demo login password for all seeded users: ${demoPassword}`);
  console.log('Example logins: avery.executive, jordan.director, casey.nguyen, sam.rivera.p1, robin.chen.p1');
}

main()
  .catch((error) => {
    console.error('Workspace seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
