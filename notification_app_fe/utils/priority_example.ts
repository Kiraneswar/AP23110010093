import { getTopNotifications, Notification } from './priority';

async function runPriorityTest() {
  const data: Notification[] = [
    { id: "1", type: "Event", message: "Hackathon started", timestamp: "2026-05-01T10:00:00Z" },
    { id: "2", type: "Result", message: "Midterm scores released", timestamp: "2026-05-01T12:00:00Z" },
    { id: "3", type: "Placement", message: "New job posting: Google", timestamp: "2026-04-30T09:00:00Z" },
    { id: "4", type: "Placement", message: "New job posting: Microsoft", timestamp: "2026-05-02T08:00:00Z" },
    { id: "5", type: "Event", message: "Guest lecture", timestamp: "2026-04-29T14:00:00Z" },
    { id: "6", type: "Result", message: "Quiz 1 scores", timestamp: "2026-04-28T11:00:00Z" }
  ];

  console.log("=== Computing Top 3 Notifications ===");
  const top3 = await getTopNotifications(data, 3);

  console.log("\nResults (Top 3):");
  top3.forEach((n, i) => {
    console.log(`${i + 1}. [${n.type}] ${n.message} (${n.timestamp})`);
  });
}

runPriorityTest();
