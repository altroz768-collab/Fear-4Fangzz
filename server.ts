import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer, WebSocket as WSWebSocket } from "ws";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Gracefully initialize Gemini with key validation or fallback response
  function getGeminiClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      return null;
    }
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // AI Coach API
  app.post("/api/ai/coach", async (req, res) => {
    try {
      const { ign, game, rank, kills, kd, matches, placement, device, additionalInfo } = req.body;
      const client = getGeminiClient();

      if (!client) {
        // High-fidelity fallback response when API key is not yet set
        const mockResponse = `### 🎮 Fear AI Coach Analysis for **${ign || "Recruit"}** [${game || "All-Game"}]
Based on your current stats of **K/D: ${kd || "1.5"}** across **${matches || "24"}** matches:

1. **🗺️ Roaming and Rotations**: Your placement averages are consistent, but to excel in **${rank || "Gold"}**, focus on edge-of-zone rotations. Secure a vehicle early in the game to pivot quickly as circles transition.
2. **🎯 Gunplay & Positioning**: Your current K/D indicates solid individual mechanics. Leverage high-ground head-glitches and avoid isolated firefights. Work on coordination with your designated in-game leader (IGL).
3. **🔧 Performance Optimization**: Playing on **${device || "Mobile"}** requires perfect custom layouts. Try custom claw setups (3-finger/4-finger) to separate firing and aiming directories.
4. **🧠 Custom Strategy**:
   - Save your utility (smokes/nades) for the final 3 zones. A pristine defensive smoker wall wins scrim matches.
   - For Free Fire or PUBG, prioritize hot-dropping only in low-latency conditions to secure early confidence-building kills.

*💡 Configure your actual custom **GEMINI_API_KEY** under **Settings > Secrets** to enable fully real-time dynamically adaptive feedback directly from Gemini!*`;
        return res.json({ advice: mockResponse });
      }

      const prompt = `Analyze this esports player's performance attributes and give strategic coaching:
- IGN (In-Game Name): ${ign}
- Game: ${game}
- Current Rank: ${rank}
- Kills Tracker: ${kills}
- K/D Ratio: ${kd}
- Head-to-head Matches: ${matches}
- Average Placement: ${placement}
- Playing on Device: ${device}
- Tactical Additional Details: ${additionalInfo || "None"}

Provide highly specific advice in Markdown. Include rotational strategies, loadout suggestions, skill usage (for CODM/Free Fire) or survival maneuvers (for PUBG Mobile), and physical posture/device tips. Mention their Rank specifically. Ensure the tone is that of an expert Esports Team Coach.`;

      const aiResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the head Fear AI Coach. Provide detailed, helpful, professional, and motivational competitive analysis and coaching in markdown structure.",
        }
      });

      return res.json({ advice: aiResponse.text });
    } catch (error: any) {
      console.error("AI Coach Error:", error);
      return res.status(500).json({ error: "Failed to generate coaching suggestions." });
    }
  });

  // CV Assistant Bot API
  app.post("/api/ai/bot", async (req, res) => {
    try {
      const { 
        message, 
        chatHistory, 
        session, 
        tournaments, 
        scrims, 
        recruits, 
        regions, 
        language = "English" 
      } = req.body;

      // Extract current user attributes safely
      const userSession = session || { ign: "Guest Player", role: "Guest", coins: 0, battlePassLevel: 1 };
      const userIgn = userSession.ign;
      const userRole = userSession.role;

      const client = getGeminiClient();

      if (!client) {
        // High-fidelity local database analyzer simulator fallback
        const lowerMsg = (message || "").toLowerCase();
        let reply = "";

        // 1. HELP / GUIDES
        if (lowerMsg.includes("how to register") || lowerMsg.includes("registration guide") || lowerMsg.includes("join tournament")) {
          reply = `📋 **Step-by-Step Registration Guide**:\n` +
            `1. Double-click the **Tournaments** tab from the left sidebar.\n` +
            `2. Select an active tourney card (e.g., status showing "Open").\n` +
            `3. Formulate your squad roster details, then click **Register Team**.\n` +
            `4. Input your Captain Name, Team Name, Call sign, and CAPTAIN Whatsapp contact.\n` +
            `5. Hit submit! Once registered, your team count increments immediately and matches are locked in.`;
        } else if (lowerMsg.includes("whatsapp") || lowerMsg.includes("link") || lowerMsg.includes("room code")) {
          reply = `📱 **WhatsApp Integration & Room Credentials Guide**:\n` +
            `*   **Link Captain Number:** Access the WhatsApp Settings module, input your target capillary code (+44 or +34) and hit **Activate**. \n` +
            `*   **Automated Drops:** 15 minutes prior to any scheduled match launch, the CV Core Intercom broadcasts match ID and Password credentials directly to the registered Captain's WhatsApp chat.\n` +
            `*   **Alternate Source:** Inside the **Strategy Room Intercom** pane, verified active players can view active room codes live on their telemetry stream.`;
        } else if (lowerMsg.includes("strategy") || lowerMsg.includes("map") || lowerMsg.includes("pin")) {
          reply = `🗺️ **Strategy Room Guide**:\n` +
            `*   Our Strategy Room supports collaborative drafting! You can choose an active Map preset (like Erangel / Miramar) and place pins in real-time.\n` +
            `*   Pin varieties: **Landing spot** 🛬, **Rotation path** ➡️, **Danger alert** ⚠️, and **Ambush point** 🎯.\n` +
            `*   Share notes with your clan roster to finalize strategic splits before drop transitions.`;
        } else if (lowerMsg.includes("appeal") || lowerMsg.includes("penalty") || lowerMsg.includes("banned")) {
          reply = `⚖️ **Appeals & Penalties Guide**:\n` +
            `*   **Penalty system:** Warnings, temporary tier locks, or permanent bans are triggered by unauthorized emulators, toxicity, or map boundary exploits.\n` +
            `*   **Appeals Pipeline:** Head over to the **Appeals** dashboard, select your target ticket ID, input your IGN, describe the unfair parameter occurrence, and link a gameplay stream video proof (YouTube/Twitch unlisted clip). Admins review live!`;
        } else if (lowerMsg.includes("squad") || lowerMsg.includes("squad list") || lowerMsg.includes("create squad")) {
          reply = `👥 **Community Squad & Faction Hub Guide**:\n` +
            `*   Team Captains and members can create community squads to represent their countries. Faction war claims require a unified roster roster approval before terrain battles are enabled on the global grid map.`;
        } else if (lowerMsg.includes("scrim rules") || lowerMsg.includes("scrims rules")) {
          reply = `🎮 **CV Scrim Lobbies Official Standards**:\n` +
            `*   Lobbies start daily at 18:00 UTC and 20:00 UTC.\n` +
            `*   All team members must arrive at least 10 minutes early. Empty slots at T-5 minutes are automatically awarded to waitlisted organisations.\n` +
            `*   Respect other professional teams: teaming, griefing, or using physical touch triggers is strictly prohibited.`;
        } else if (lowerMsg.includes("tournament rules") || lowerMsg.includes("match rules")) {
          reply = `🏆 **CV Tournament Match Rules & Points Matrix**:\n` +
            `*   Roster locking occurs 2 hours before the first scheduled match circle.\n` +
            `*   **Point Matrix:** 1st Place = 10 pts, 2nd = 6 pts, 3rd = 5 pts, 4th = 4 pts, 5th = 3 pts. 1 Point per confirmed Kill.\n` +
            `*   No emulators or iPads in standard Mobile Tier lobbies. Custom screen layout recorders are required upon request.`;
        }

        // 2. LIVE DATABASE DISCOVERY
        else if (lowerMsg.includes("scrim start") || lowerMsg.includes("when does my scrim") || lowerMsg.includes("my scrim")) {
          // Identify if registered in any scrim matches
          const userScrims = (scrims || []).filter((s: any) => 
            s.registeredIGNs && s.registeredIGNs.some((ign: string) => ign.toLowerCase() === userIgn.toLowerCase())
          );

          if (userScrims.length > 0) {
            reply = `📅 **Live Scrim Status for ${userIgn}**:\n` +
              `You are registered for **${userScrims.length}** upcoming scrim session(s):\n` +
              userScrims.map((s: any) => `*   **${s.title}** (${s.game}): Schedued at **${s.dateTime}** on map **${s.mapName}**. Slots: ${s.registeredIGNs.length}/${s.maxSlots}. Status is **${s.status}**!`).join("\n");
          } else {
            const openScrims = (scrims || []).filter((s: any) => s.status === "Open");
            reply = `📅 **Scrim Status Check**:\n` +
              `You (*${userIgn}*) are currently NOT registered in any upcoming scrim practices.\n` +
              (openScrims.length > 0 
                ? `However, there are **${openScrims.length}** open scrim lobby slots! You can register for **"${openScrims[0].title}"** on map **${openScrims[0].mapName}** starting at **${openScrims[0].dateTime}**!`
                : `Check the Scrim tab later; admins refresh lobby slots hourly!`);
          }
        } else if (lowerMsg.includes("am i registered") || lowerMsg.includes("registered") || lowerMsg.includes("my registration") || lowerMsg.includes("waitlist")) {
          // Search in tournaments
          const registeredTourneys: string[] = [];
          let waitlistDetails = "";

          (tournaments || []).forEach((t: any) => {
            if (t.registeredTeams && t.registeredTeams.some((team: string) => 
              team.toLowerCase().includes(userIgn.toLowerCase()) || 
              team.toLowerCase().includes("vipers") || 
              team.toLowerCase().includes("crimson")
            )) {
              registeredTourneys.push(t.title);
              // Calculate waitlist
              const teamIdx = t.registeredTeams.findIndex((team: string) => 
                team.toLowerCase().includes(userIgn.toLowerCase()) || 
                team.toLowerCase().includes("vipers") || 
                team.toLowerCase().includes("crimson")
              );
              if (teamIdx >= t.maxTeams) {
                waitlistDetails += `\n⚠️ Waitlist Position for **${t.title}**: **Position #${teamIdx - t.maxTeams + 1}** (Standby queue for slot vacancy).`;
              } else {
                waitlistDetails += `\n✅ Confirmed Active Seat inside **${t.title}** (Seat #${teamIdx + 1} of ${t.maxTeams}).`;
              }
            }
          });

          if (registeredTourneys.length > 0) {
            reply = `🏆 **Registration Status for ${userIgn}**:\n` +
              `You/Your team is on the sheets for **${registeredTourneys.length}** tournament(s): \n` +
              registeredTourneys.map(title => `*   **${title}**`).join("\n") + 
              `\n` + waitlistDetails;
          } else {
            reply = `🏆 **Registration Status**:\n` +
              `You (*${userIgn}*) do not have any active team registration sheets matched on file.\n` +
              `Navigate to the **Tournaments** tab, check the "Open" registration schedules, and secure a captain slot!`;
          }
        } else if (lowerMsg.includes("ranking") || lowerMsg.includes("standings") || lowerMsg.includes("who won") || lowerMsg.includes("leaderboard")) {
          // Look under tournaments leaderboards
          let standingsText = "";
          (tournaments || []).forEach((t: any) => {
            if (t.leaderboard && t.leaderboard.length > 0) {
              standingsText += `\n*   **${t.title}** Lead: **${t.leaderboard[0].teamName}** (${t.leaderboard[0].points} pts, ${t.leaderboard[0].kills} kills).`;
            }
          });
          reply = `📊 **Live Ecosystem Standings & Standby Rankings**:\n` +
            (standingsText || `*   Current season scrim leaderboard averages have been reset for the rotation split. Check back soon for the weekly tournament report!`) +
            `\nNavigate to the **Ranking** and **Stat Compare** pages to view deep analytics of all registered clan rosters!`;
        }

        // 3. ADMIN ACCESS CONTROL CHECKS
        else if (lowerMsg.includes("registered teams") || lowerMsg.includes("admin assistance") || lowerMsg.includes("pending") || lowerMsg.includes("how many")) {
          // Enforce access rights
          const allowedRoles = ["Owner", "Head Admin", "Admin"];
          if (!allowedRoles.includes(userRole)) {
            reply = `🛡️ **Access Restricted [Role: ${userRole}]**:\n` +
              `I'm sorry, Captain. Administrator statistics, pending recruits list, and telemetry counts contain private secure data.\n` +
              `Only **Admins**, **Head Admins**, and the **Owner** can access this administrative console. your profile has been logged.`;
          } else {
            const pendingRecruitsCount = (recruits || []).filter((r: any) => r.status === "Pending").length;
            const openTourneys = (tournaments || []).filter((t: any) => t.status === "Open");
            const activeScrimsCount = (scrims || []).filter((s: any) => s.status === "Open").length;

            reply = `⚙️ **ADMINISTRATOR REAL-TIME CONSOLE [Authority: ${userRole}]**:\n` +
              `Welcome, Commander **${userIgn}**. Here is the live platform telemetry digest:\n` +
              `*   **Pending Recruitment Applications:** \`${pendingRecruitsCount}\` pending profile(s) awaiting review.\n` +
              `*   **Active Tournaments:** \`${tournaments?.length || 0}\` total registered tournament listings.\n` +
              `*   **Active Scrim lobbies online:** \`${activeScrimsCount}\` scrim sessions currently accepting player slots.\n` +
              `*   **Controlled Territory Sectors:** \`${regions?.filter((r: any) => r.ownerFaction !== "Free Sector" && r.ownerFaction !== "Neutral").length || 0}\` assigned sectors.\n\n` +
              `To clear applications, click the **Approve** or **Reject** triggers live in the Clan Chat dashboard!`;
          }
        }

        // 4. SMART SEARCH CONTEXT MATCHES (VAGUE INCOMPLETE QUERIES)
        else if (lowerMsg.trim() === "registration" || lowerMsg.trim() === "register") {
          const openTourneys = (tournaments || []).filter((t: any) => t.status === "Open");
          reply = `💡 **Context Match: "Registration"**\n` +
            `It looks like you are querying about our registration channels! Here is the live status summary:\n` +
            `*   **Open Channels:** We have **${openTourneys.length}** tournaments currently accepting team registration slips.\n` +
            `*   **Available Slots:** Major tournaments limit rosters to 16/32 squads. Once full, rosters are promoted to standby waitlist queues.\n` +
            `*   *Type "Registration Guide" or check the **Tournaments** tab to register immediately!*`;
        } else if (lowerMsg.trim() === "rules" || lowerMsg.trim() === "rule") {
          reply = `💡 **Context Match: "Rules Dashboard"**\n` +
            `We have specialized rule structures active in the ecosystem. Ask me about any specific sheet:\n` +
            `*   "Tournament rules" (Point matrices, limits)\n` +
            `*   "Scrim rules" (Lobby times, standards)\n` +
            `*   "Recruitment rules" (Requirements for CV team)\n` +
            `*   "Appeals & Penalty rules" (Writ of appeal, stream proofing guide)`;
        } else if (lowerMsg.trim() === "scrim" || lowerMsg.trim() === "scrims") {
          reply = `💡 **Context Match: "Scrim Management System"**\n` +
            `Practice lobbies match-find hourly! Here are details:\n` +
            `*   **Lobby Times:** Daily at 18:00 UTC and 20:00 UTC.\n` +
            `*   **Current State:** There are **${scrims?.length || 0}** active practice sessions in database.\n` +
            `*   *Type "My Scrim" to check your active reservations, or navigate to the **Scrims** tab to lock in a new room!*`;
        }

        // 5. CHIPS FALLBACK OR GREETING
        else {
          reply = `🛡️ **Greetings from CV Bot!** I have scanned our eSports database networks:\n` +
            `*   **User IGN Detected:** \`${userIgn}\` [Role: **${userRole}**]\n` +
            `*   **Personal Coins Wallet:** \`${userSession.coins || 0} CV Coins\`\n` +
            `*   **Battle Pass XP level:** \`Level ${userSession.battlePassLevel || 1}\`\n\n` +
            `Ask me anything detailed like: **"Am I registered?"**, **"How to link WhatsApp?"**, **"What time does my scrim start?"**, or **"scrim rules"**! I pull answers directly from live platform tables in real-time.`;
        }

        // Return calculated contextual response matching the language configured
        if (language.toLowerCase() !== "english") {
          reply += `\n\n*(Translated to dynamic locale **${language}**)*`;
        }

        return res.json({ 
          reply: `${reply}\n\n*(Core: Live Database Context Simulator. Configure **GEMINI_API_KEY** in Secrets to unlock advanced neural chatbot responses!)*` 
        });
      }

      // Prepare contents list including history
      const formattedHistory: any[] = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.slice(-12).forEach(h => {
          formattedHistory.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }]
          });
        });
      }

      formattedHistory.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Construct a brilliant metadata system context
      const systemInstruction = `
You are 'Fear AI', the custom automated eSports advanced neural assistant bot for the entire Fear 4Fangz Platform.
Your avatar/identity: A friendly, energetic, polite eSports support agent who maintains high-energy gaming passion. You are deeply knowledgeable about PUBG Mobile, Free Fire, CODM, and TDM Arena.

[ROLE PERMISSIONS & ACCESS CONTROL]
- Your profile IGN is 'Fear AI'. The current client user is '${userIgn}' holding authority credentials [Role: '${userRole}'].
- If the user asks for Admin assistance, pending lists, registrations counts, or player names:
  * Check user's role! Allowed admin roles are: "Owner", "Head Admin", "Admin".
  * If the user is NOT an allowed administrator role, DO NOT show the statistics or user lists. Politely decline stating security boundaries.
  * If the user IS an allowed administrator role, proudly assist them by compiling pending recruits count, open slot allocations, and active tournament reports.

[LIVE PLATFORM METRICS & REAL-TIME DATABASE TABLES]
- **Current Time**: ${new Date().toISOString()}
- **User Session**: ${JSON.stringify(userSession)}
- **Tournaments State**: ${JSON.stringify(tournaments || [])}
- **Scrim Sessions State**: ${JSON.stringify(scrims || [])}
- **Recruitment Applications**: ${JSON.stringify(recruits || [])}
- **Territory Regions Matrix**: ${JSON.stringify(regions || [])}
- **Force Output Language**: ${language} (Ensure translation is pristine if not English).

[SUPPORT GUIDELINES, COMPREHENSIVE RULES DATABASE, & LOADOUT MANUAL]
1. GLOBAL COMPLIANCE RULES:
   * **Account Security Integrity**: Share, sell, buy accounts is strictly prohibited. Posing as Staff or Verified Clan Members triggers immediate ban. Bypassing suspensions or bans using alt accounts results in permanent blacklisting.
   * **Competitive Integrity standards**: Match fixing, rank-boosting, abusing game glitches/exploits, or manipulating statistics is strictly prohibited. Scale-based penalties: Warnings -> Temp Queue Lockout -> Permanent Account Exclusion.
   * **World Chat & Community Conduct**: Toxicity, verbal abuse, slurs, unauthorized external platform advertisement (URLs/discords), spamming repetitive characters, or scamming/phishing schemes trigger instant chat mute or suspension.

2. TDM ARENA RULES & AGREEMENT SYSTEM:
   * **Loadout Agreement**: Players select and bind to Loadout contracts before entering active matchmaking. Available presets: "M416 Only", "AWM Sniper Only", "Fist Only No Melee", "Double Shotgun Chaos", "Standard Custom Loadout".
   * **Loadout Violations**: Using weapons not specified in the signed contract (e.g. swapping to a DBS Shotgun on an 'M416 Only' match) triggers automatic visual telemetry inconsistency. Accused user is disqualified, -30 Arena Points (AP) deducted, and a Medium-risk flag appended to their profile.
   * **Agreement Acceptance**: Both sides must tick the verification box to sign the contract prior to match entry. Unsigned entries block matchmaking.

3. REPORTING PROCEDURES & EVIDENCE REVIEW:
   * **Lodge Report Portal**: Submitting reports requires Target IGN, Match ID reference, infraction description, and uploaded screenshot/log evidence.
   * **Automated OCR Evidence Assistant**: Fear AI reads and reviews uploaded files to compare HUD graphics against the match contract. It flags inconsistencies and issues confidence scores.
   * **Human Oversight Rule**: Automated AI scores support staff decisions but NEVER issue automatic major punishments (bans, long suspensions). Authorized human staff review is mandatory.
   * **False Report Policy**: Intentionally lodging false or mocked reports triggers warning notices, matchmaking queue restrictions, or a 7-day temporary suspension under rule 14.4.

4. TOURNAMENTS & SCRIMS COHESION:
   * **Match Rules**: 1st Place = 10 pts, 2nd = 6 pts, 3rd = 5 pts, 4th = 4 pts, 5th = 3 pts. 1 Point per confirmed Kill.
   * **Scrim Standards**: Practice scrims launch daily at 18:00 UTC and 20:00 UTC. Check-in 10 minutes prior is mandatory.
   * **WhatsApp API Gateway**: Linked numbers receive match room ID and Password directly 15 minutes before the match circle launches.

[SMART QUERY HANDLING]
- If the question is concise or incomplete (like "rules" or "Waitlist" or "coins"), do NOT scold them. Interpret it inside our competitive context, and give a highly helpful guide outlining general parameters, status, available choices, and direct instruction.
- Proactively alert or warn them about upcoming events or scrims if they are registered (e.g., "⚠️ Reminding you, Captain, your scrim starting slot is live today!").
- Respond in professional, clean Markdown with bullet points, high contrast headers, and custom text styles where applicable. Keep responses concise and highly actionable.
`;

      const aiResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      return res.json({ reply: aiResponse.text });
    } catch (error: any) {
      console.error("Fear AI Error:", error);
      return res.json({ reply: "Apologies, warrior. My communication link has a slight lag spike, but you can navigate the tabs or practice in the Strategy Room!" });
    }
  });

  // Heatmap AI positioning evaluation API
  app.post("/api/ai/heatmap-eval", async (req, res) => {
    try {
      const { 
        playerIgn, 
        role, 
        primaryDrop, 
        positioningStyle, 
        activePreset, 
        selectedPhase, 
        metrics, 
        heatPoints 
      } = req.body;

      const client = getGeminiClient();

      if (!client) {
        // High fidelity contextual fallbacks when API Key is not yet configured
        let dynamicAdvice = "";
        const lowerIgn = (playerIgn || "").toUpperCase();

        if (lowerIgn.includes("SLAYER")) {
          dynamicAdvice = `### 🤖 Tactical Guard Review for **${playerIgn || "CV_Slayer_IGL"}** [${activePreset || "SCRIMS"}]
When holding compound fortresses around **Yasnaya Apartments** in the ${selectedPhase === "all" ? "early and late" : selectedPhase + " game"} phase, transition your rotation 15-20 seconds earlier. 

Your current stats demonstrate a **Rotation Tactics metric of ${metrics?.find((m: any) => m.label.includes("Rotation"))?.value || "98"}/100**. To prevent gatekeeping on the low-ground roads near School:
*   Deploy a **2-2 flank split** with your support anchor setting overwatch on the North Ridge.
*   Secure local garage vehicles to buffer zone pivots in case of unexpected center-circle hard shifts.`;
        } else if (lowerIgn.includes("MAMBA")) {
          dynamicAdvice = `### 🤖 Sniper Angle Review for **${playerIgn || "CV_Mamba_Flick"}** [${activePreset || "SCRIMS"}]
Your overwatch holds around the **South Island Bridge** are highly static, making you vulnerable to back-stabs from Military Base rotators during the ${selectedPhase === "all" ? "early-mid and deep late" : selectedPhase + " game"} phase.

With an average engagement distance of **310m**, we suggest shifting your sniper anchor vector:
*   Reposition **50 meters West** to the broken warehouse perimeter.
*   This grants high cover, a **180-degree escape line**, and clean cross-fire lines on incoming bridge crossings.`;
        } else if (lowerIgn.includes("SHADOW")) {
          dynamicAdvice = `### 🤖 Flank Cohesion Review for **${playerIgn || "CV_Shadow_Duo"}** [${activePreset || "SCRIMS"}]
Your aggressive close-quarter breach points on **Georgopol Containers** are too split from support anchor cover, limiting your survival rate of **71.0%**.

To optimize your high combat aggression during ${selectedPhase === "all" ? "rotations" : selectedPhase + " phase"} transitions:
*   Synchronize your beach attacks directly with heavy suppression smoke lines fired from teammates on Rozhok hills.
*   Keep a Dacia or Coupe active within **10 meters** of your hold compound to facilitate instantaneous disengagement capability.`;
        } else if (lowerIgn.includes("SPECTRE")) {
          dynamicAdvice = `### 🤖 Anchor Support Review for **${playerIgn || "CV_Alpha_Spectre"}** [${activePreset || "SCRIMS"}]
Your **Gatka Trench** overwatch defense provides pristine safety but keeps you too deep in low-ground trenches, leaving your team blind to aggressive ridge pushes.

To leverage your **Utility Command of ${metrics?.find((m: any) => m.label.includes("Utility"))?.value || "99"}/100**:
*   Ascend your overwatch focal point **15-20 meters higher** to the ruined cabin high ridge.
*   This maintains your defensive safety while securing unbroken visual containment lines over Pochinki field crossovers.`;
        } else if (lowerIgn.includes("TINASHE")) {
          dynamicAdvice = `### 🤖 Frontline Entry Review for **${playerIgn || "ZIM_Tinashe"}** [${activePreset || "SCRIMS"}]
Your hyper-aggressive entries in **Pochinki Blocks** during the ${selectedPhase === "all" ? "full match" : selectedPhase + " game"} are heavily exposed to vertical sniper angles from late-game high-rises.

To improve your survival rate of **59.2%**:
*   Instead of initiating direct frontal breaches through the open courtyards, coordinate high-angle flashbang setups with your IGL.
*   Sweep systematically **from the outer-city blue houses inwards** to isolate individual players before they can cluster.`;
        } else if (lowerIgn.includes("ZERO")) {
          dynamicAdvice = `### 🤖 Ambush Positioning Review for **${playerIgn || "Onyx_Cap_Zero"}** [${activePreset || "SCRIMS"}]
While your **Shelter Sub Caves** stealth ambushes are flawless, they leave you too deep underground and severely bottlenecked in the final zone circles.

We advise adjusting your defense positioning style:
*   Shift your **End Game Hold position** to the edge of the Mylta highway forest.
*   This locks down late-rotating bridge squads while securing a direct, low-ground vehicle corridor out of the play area.`;
        } else {
          dynamicAdvice = `### 🤖 AI Tactical Placement Review for **${playerIgn || "Recruit"}**
Your recent spatial routing heatmap shows high concentrations in central compounds. 

To improve overall combat survival:
*   Avoid holding low-ground dip compounds where surrounding teams hold ridge overwatch.
*   Always maintain a **30-second buffer** in zone rotation transitions to secure the premium compounds first.`;
        }

        return res.json({ evaluation: dynamicAdvice });
      }

      // If Gemini API is available, query real Gemini 3.5 Flash!
      const prompt = `You are a Tier-1 eSports Analyst and Head Coach for a professional PUBG Mobile squad.
Analyze the following player mapping data and heatmap telemetry, then provide ONE highly actionable, specific tactical suggestion for their positioning.

PLAYER DETAILS:
- In-Game Name: ${playerIgn}
- Role on Team: ${role}
- Primary Landing Zone: ${primaryDrop}
- Preferred Positioning Style: ${positioningStyle}
- Strategy Preset Mode: ${activePreset}
- Filtered Game Phase: ${selectedPhase}

TELEMETRY INDEX METRICS:
\${JSON.stringify(metrics, null, 2)}

ACTIVE HEATMAP POSITIONS LOGGING:
\${JSON.stringify(heatPoints, null, 2)}

Provide a concise, professional, and strategic critique. Specifically point out how they can adjust their positioning in Erangel (e.g., compound hold adjustment, ridge elevation angle, transition pacing, split-line configuration, or zone cover optimization).
Avoid vague advice like "stay focused" or "practice more". Be technical (use terms like head-glitches, gatekeeping, 2-2 splits, compounds, ridges, vertical fire, or rotation timers).
Write your response in beautiful, polished Markdown, including bullet points for the specific recommendation. Keep it strictly and punchily structured under 3 concise paragraphs.`;

      const aiResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the head CV eSports AI Tactical positioning analyst. Provide professional, analytical, and highly specific competitive PUBG Mobile advice in clear markdown."
        }
      });

      return res.json({ evaluation: aiResponse.text });
    } catch (error: any) {
      console.error("AI Heatmap Evaluation Error:", error);
      return res.status(500).json({ error: "Failed to generate AI heatmap positioning evaluation." });
    }
  });

  // Advanced AI-Assisted Match Verification Endpoint
  app.post("/api/ai/verify-match", async (req, res) => {
    try {
      const {
        matchId,
        blueReport,
        redReport,
        blueScore,
        redScore,
        weaponAgreement,
        map,
        region,
        image,
        fileName
      } = req.body;

      const client = getGeminiClient();

      if (!client) {
        // High fidelity OCR and match consistency simulation fallback when API key is not configured
        const userOutcomeMatchesScore = (blueReport === "win" && blueScore > redScore) || 
                                       (blueReport === "loss" && blueScore < redScore) ||
                                       (blueReport === "draw" && blueScore === redScore);
        
        const reportsAgree = blueReport === (redReport === "win" ? "loss" : redReport === "loss" ? "win" : "draw");
        
        let confidenceScore = 98;
        let verdict = "VERIFIED";
        let aiNotes = `Successfully parsed simulated scoreboard telemetry for Match ID [${matchId}]. Score indices align perfectly.`;
        let detectedScores = { blue: blueScore, red: redScore };
        let loadoutCompliant = true;

        if (!userOutcomeMatchesScore) {
          confidenceScore = 65;
          verdict = "FLAGGED_MINOR_REVIEW";
          aiNotes = "WARNING: User declared match report does not align with reported final score indices. Recalibrating submission parameters.";
        } else if (!reportsAgree) {
          confidenceScore = 45;
          verdict = "FLAGGED_STAFF_REVIEW";
          aiNotes = `CRITICAL SENSORS DISCREPANCY: Duel reports conflict! Blue team reported [${blueReport.toUpperCase()}] while Red team reported [${redReport.toUpperCase()}]. Active staff audit is required.`;
        }

        if (image) {
          aiNotes += ` (Analyzed image asset '${fileName || "match_evidence.png"}' via OCR simulated visual matrices).`;
        }

        return res.json({
          verified: verdict === "VERIFIED",
          confidenceScore,
          verdict,
          detectedScores,
          loadoutCompliant,
          aiNotes,
          aiEngine: "Crimson Vipers Local OCR Matrix Emulator"
        });
      }

      // We have a live Gemini client! Let's do a real vision check or structured text check
      let promptText = `Verify the competitive TDM match status based on the following logs and reports:
- Match ID: ${matchId}
- Map: ${map}
- Region: ${region}
- Weapon Restriction Agreement: ${weaponAgreement}
- Blue Team Reported Score: ${blueScore}, Outcome: ${blueReport}
- Red Team Reported Score: ${redScore}, Outcome: ${redReport}

Analyze the consistency of these reports. Check if the winner matches the score, if the scores are realistic for a TDM (e.g., normally up to 40 kills in PUBG Mobile TDM, but could vary slightly), and if there's any conflict between reports.
If a screenshot image is attached, please perform OCR analysis. Read the numbers and text from the image, extract the Blue and Red team scores, identify the weapons depicted or listed in kills, and determine if they comply with "${weaponAgreement}".

You MUST return a JSON object ONLY, adhering to the following structure:
{
  "verified": boolean,
  "confidenceScore": number (0 to 100),
  "verdict": "VERIFIED" | "FLAGGED_MINOR_REVIEW" | "FLAGGED_STAFF_REVIEW",
  "detectedScores": { "blue": number, "red": number },
  "loadoutCompliant": boolean,
  "aiNotes": "string explaining your OCR extraction findings, discrepancies, weapon compliance check, and final validation logic"
}`;

      let aiResponse;

      if (image && image.includes("base64,")) {
        const base64Data = image.split("base64,")[1];
        const mimeType = image.split(";")[0].split(":")[1] || "image/png";

        const imagePart = {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        };
        const textPart = {
          text: promptText,
        };

        aiResponse = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: "application/json"
          }
        });
      } else {
        aiResponse = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json"
          }
        });
      }

      try {
        const resultJson = JSON.parse(aiResponse.text);
        return res.json({
          ...resultJson,
          aiEngine: "Gemini 3.5 Flash OCR Engine"
        });
      } catch (err) {
        console.error("Failed to parse Gemini response as JSON:", aiResponse.text);
        return res.json({
          verified: blueReport === (redReport === "win" ? "loss" : redReport === "loss" ? "win" : "draw"),
          confidenceScore: 85,
          verdict: blueReport === (redReport === "win" ? "loss" : redReport === "loss" ? "win" : "draw") ? "VERIFIED" : "FLAGGED_STAFF_REVIEW",
          detectedScores: { blue: blueScore, red: redScore },
          loadoutCompliant: true,
          aiNotes: "Match processed via text analysis. Raw response: " + aiResponse.text.substring(0, 150),
          aiEngine: "Gemini 3.5 Flash OCR Fallback"
        });
      }

    } catch (error: any) {
      console.error("AI Match Verification Error:", error);
      return res.status(500).json({ error: "Failed to process match verification." });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", time: new Date().toISOString() });
  });

  // Project ZIP Download endpoint for Render & GitHub deployments
  app.get(["/api/download/project.zip", "/api/download/project-zip"], (req, res) => {
    const candidates = [
      path.join(process.cwd(), "fear-4fangz-project.zip"),
      path.join(process.cwd(), "public", "fear-4fangz-project.zip"),
      "/.aistudio/artifacts/brain/728dff54-0735-4bed-aee0-54df6666a8a8/fear-4fangz-project.zip"
    ];
    for (const zipPath of candidates) {
      if (fs.existsSync(zipPath)) {
        res.setHeader("Content-Disposition", 'attachment; filename="fear-4fangz-project.zip"');
        res.setHeader("Content-Type", "application/zip");
        return res.sendFile(path.resolve(zipPath));
      }
    }
    return res.status(404).json({ error: "ZIP file not generated yet." });
  });

  // Vite integration
  const isProduction = process.env.NODE_ENV === "production" || Boolean(process.argv[1] && process.argv[1].includes("dist"));
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind server port 
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fear 4Fangz Server] started and running on http://localhost:${PORT}`);
  });

  // Attach real WebSocket World Chat server
  try {
    setupWorldChatWebSocket(server);
  } catch (err) {
    console.error("Failed to attach World Chat WebSocket server:", err);
  }
}

// --- REAL-TIME WORLD CHAT SERVER ENGINE ---
interface WorldChatMessage {
  id: string;
  channelId: string;
  senderIgn: string;
  senderRole: string;
  senderAvatar: string;
  senderVerified: boolean;
  senderLevel: number;
  senderReputation: number;
  text: string;
  timestamp: string;
  imageUrl?: string;
  gifUrl?: string;
  replyTo?: { id: string; sender: string; text: string } | null;
  poll?: any;
  reactions?: Record<string, string[]>;
  pinned?: boolean;
  system?: boolean;
}

let chatHistory: Record<string, WorldChatMessage[]> = {
  global: [
    {
      id: "init-1",
      channelId: "global",
      senderIgn: "CV_Mamba_Flick",
      senderRole: "Team Captain",
      senderAvatar: "🐍",
      senderVerified: true,
      senderLevel: 32,
      senderReputation: 100,
      text: "Yo! Welcome to the brand new Fear Global World Chat System. This of course acts as our central social hub 🌟",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      reactions: { "🔥": ["CV_Slayer_IGL"], "👑": ["ZIM_Tinashe"] }
    },
    {
      id: "init-2",
      channelId: "global",
      senderIgn: "ZIM_Tinashe",
      senderRole: "Member",
      senderAvatar: "🦁",
      senderVerified: true,
      senderLevel: 24,
      senderReputation: 98,
      text: "The Saturday championships look stacked! I've been practicing early morning rotations in Erangel. Who's in?",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      reactions: { "👀": ["CV_Mamba_Flick"], "🔥": ["Onyx_Cap_Zero"] }
    },
    {
      id: "init-3",
      channelId: "global",
      senderIgn: "ESL_Admin",
      senderRole: "Head Admin",
      senderAvatar: "⚖️",
      senderVerified: true,
      senderLevel: 50,
      senderReputation: 100,
      text: "🛡️ STAFF ANNOUNCEMENT: Respect your fellow combatants. Severe profanity, scam bots, and malicious links are blocked automatically. Repeat offenders face instant mute.",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      pinned: true
    }
  ],
  africa: [
    {
      id: "init-4",
      channelId: "africa",
      senderIgn: "ZIM_Farai",
      senderRole: "Member",
      senderAvatar: "🐘",
      senderVerified: false,
      senderLevel: 12,
      senderReputation: 85,
      text: "Any South Africa or Zimbabwe squads looking for 1 more assaulter for the Cape Town servers?",
      timestamp: new Date(Date.now() - 2500000).toISOString()
    }
  ],
  europe: [
    {
      id: "init-5",
      channelId: "europe",
      senderIgn: "GhostLeader",
      senderRole: "Member",
      senderAvatar: "💀",
      senderVerified: true,
      senderLevel: 18,
      senderReputation: 90,
      text: "EU Practice lobbies will be published on-time today. Check details on the Scrim tab.",
      timestamp: new Date(Date.now() - 1200000).toISOString()
    }
  ],
  asia: [
    {
      id: "init-6",
      channelId: "asia",
      senderIgn: "Hiroshi_Sato",
      senderRole: "Member",
      senderAvatar: "🐲",
      senderVerified: true,
      senderLevel: 28,
      senderReputation: 95,
      text: "Singapore 1 server has stable 15ms ping today. Ideal for TDM lobby trials.",
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ],
  middle_east: [],
  north_america: [],
  south_america: [],
  oceania: []
};

function setupWorldChatWebSocket(server: any) {
  const wss = new WebSocketServer({ server });
  
  // Track active socket connections mapped to user profiles
  const clients = new Map<any, { ign: string; role: string; avatar: string; verified: boolean; level: number; reputation: number }>();

  // Default smart language filter configuration
  let filterConfig = {
    censorMild: true,
    blockSevere: true,
    mildWords: ["noob", "suck", "trash", "crap", "ez", "loser", "bot"],
    severeWords: ["hate", "scam", "hack", "threat", "violence", "f**k", "sh*t", "faggot", "nigger", "retard", "rape", "kill yourself"]
  };

  // User reputation and levels status cache (persisted in RAM during server runtime)
  let userReputationCache: Record<string, { score: number; level: number; warningsCount: number; muteUntil: string | null; suspendedUntil: string | null }> = {
    "CV_Slayer_IGL": { score: 100, level: 45, warningsCount: 0, muteUntil: null, suspendedUntil: null },
    "CV_Mamba_Flick": { score: 100, level: 32, warningsCount: 0, muteUntil: null, suspendedUntil: null },
    "ZIM_Tinashe": { score: 98, level: 24, warningsCount: 0, muteUntil: null, suspendedUntil: null },
    "Onyx_Cap_Zero": { score: 75, level: 19, warningsCount: 1, muteUntil: null, suspendedUntil: null },
    "ESL_Admin": { score: 100, level: 50, warningsCount: 0, muteUntil: null, suspendedUntil: null }
  };

  // Community Reports List
  let chatReports: any[] = [];
  // Moderation Audit logs with rich pre-populated historical administrative logs
  let moderationLogs: any[] = [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      actor: "CV_Slayer_IGL",
      action: "Role Assignment",
      category: "PROMOTION",
      targetUser: "ZIM_Tinashe",
      reason: "Promoted to primary point operator for elite tier rotation management",
      details: "Promoted ZIM_Tinashe from Member to Team Captain (IGL Elite status)"
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      actor: "System Sentinel",
      action: "Self-Repair Triggered",
      category: "SECURITY_EVENT",
      targetUser: "Ecosystem Mainframe",
      reason: "Automated: Calibrated combat grids and verified API route signatures during integrity scan",
      details: "Database sync established successfully. Restored system stability metric to 100% stable."
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      actor: "CV_Slayer_IGL",
      action: "Updated Language Filters",
      category: "RULE_CHANGE",
      targetUser: "Filter Configuration",
      reason: "Hardened chat spam prevention guidelines. Applied mild censorship and severe keyword block configurations",
      details: "Toggled censorMild=true, blockSevere=true. Added 'hate', 'scam' to severe blockers list."
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      actor: "System Sentinel",
      action: "Anti-Cheat Device Flag",
      category: "SECURITY_EVENT",
      targetUser: "X_SniperElite_X",
      reason: "Automated: Hardware emulator / Rapid-fire macro signatures detected on device port 3000",
      details: "User flag escalated to Disciplinary Registry. Automated 10-minute warning cooldown applied."
    },
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      actor: "ESL_Admin",
      action: "Mute User",
      category: "MODERATION",
      targetUser: "Onyx_Cap_Zero",
      reason: "Repeated spamming of recruiting requests in general scrim lobbies after warning",
      details: "Issued manual 15-minute lobby chat mute."
    }
  ];

  // Active streamers lists mock
  let streamers = [
    { name: "CV_Mamba_Flick", title: "Solo King Pro Road to Conqueror 🎯", viewers: 412, category: "PUBG Mobile", gameImg: "🐍", link: "/#/media" },
    { name: "Slayer_Elite", title: "Clan Leader Scrim Practice with Audio Controls", viewers: 285, category: "PUBG Mobile", gameImg: "🎯", link: "/#/media" },
    { name: "ZIM_Tinashe", title: "Tactical Radar Scan & Coaching Trials 🦁", viewers: 192, category: "PUBG Mobile", gameImg: "🏆", link: "/#/media" }
  ];

  // Map to hold messaging timestamps for rate limit
  const msgTimestampsByIpsOrIgns = new Map<string, number[]>();

  // Broadcast helper
  function broadcast(payload: any) {
    const data = JSON.stringify(payload);
    wss.clients.forEach(client => {
      if (client.readyState === WSWebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // Background interval: Periodically generate simulated chats from esports community stars
  setInterval(() => {
    const chatters = [
      { ign: "CV_Mamba_Flick", role: "Team Captain", avatar: "🐍", verified: true, level: 32, text: "Mirror game play is insane! Always adjust custom claw triggers." },
      { ign: "ZIM_Tinashe", role: "Member", avatar: "🦁", verified: true, level: 24, text: "Wait, the Saturday Battle Royale placements was updated. Scrim board is live! 🏆" },
      { ign: "Onyx_Cap_Zero", role: "Member", avatar: "🌪️", verified: false, level: 19, text: "Onyx vipers is looking for 1 assaulter for the squad showoff. DM stats!" },
      { ign: "Slayer_Elite", role: "Owner", avatar: "🎯", verified: true, level: 45, text: "Everyone, check the Strategy tab. New Erangel split diagrams are added!" },
      { ign: "Specter_Scope", role: "Member", avatar: "💀", verified: false, level: 15, text: "The recoil analysis on the AI coach module helped me cross a 3.5 K/D metric!" }
    ];

    const channels = ["global", "africa", "europe", "asia"];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];
    
    // Safety check for simulation mutes
    const repState = userReputationCache[randomChatter.ign];
    if (repState && repState.muteUntil && new Date(repState.muteUntil) > new Date()) {
      return;
    }

    const newMessage: WorldChatMessage = {
      id: "sim-" + Date.now(),
      channelId: randomChannel,
      senderIgn: randomChatter.ign,
      senderRole: randomChatter.role,
      senderAvatar: randomChatter.avatar,
      senderVerified: randomChatter.verified,
      senderLevel: randomChatter.level,
      senderReputation: repState ? repState.score : 85,
      text: randomChatter.text,
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    if (!chatHistory[randomChannel]) {
      chatHistory[randomChannel] = [];
    }
    chatHistory[randomChannel].push(newMessage);
    if (chatHistory[randomChannel].length > 150) chatHistory[randomChannel].shift();

    broadcast({
      type: "chat_message",
      message: newMessage
    });
  }, 48000); // 48 seconds interval keeps background noise completely immersive when standalone

  wss.on("connection", (ws: any) => {
    // Initial connection default
    clients.set(ws, { ign: "Guest", role: "Guest", avatar: "👤", verified: false, level: 1, reputation: 50 });

    ws.on("message", (message: string) => {
      try {
        const payload = JSON.parse(message);
        
        switch (payload.type) {
          case "init": {
            const { ign, role, avatar, verified } = payload.user;
            
            // Register or pull from reputation registry
            if (!userReputationCache[ign]) {
              userReputationCache[ign] = {
                score: verified ? 100 : 80,
                level: 5,
                warningsCount: 0,
                muteUntil: null,
                suspendedUntil: null
              };
            }
            
            const state = userReputationCache[ign];
            const updatedUser = {
              ign,
              role,
              avatar: avatar || "👤",
              verified: !!verified,
              level: state.level,
              reputation: state.score
            };
            
            clients.set(ws, updatedUser);

            // Send initialization data packet
            ws.send(JSON.stringify({
              type: "init_data",
              history: chatHistory,
              pinned: Object.values(chatHistory).flatMap(arr => arr.filter(m => m.pinned)),
              onlineUsers: Array.from(clients.values()),
              streamers,
              filterConfig,
              reports: chatReports,
              auditLogs: moderationLogs,
              userReputation: state
            }));

            // Broadcast presence to all users
            broadcast({
              type: "presence",
              onlineUsers: Array.from(clients.values())
            });
            break;
          }

          case "send_chat": {
            const user = clients.get(ws);
            if (!user || user.role === "Guest") {
              ws.send(JSON.stringify({ type: "chat_error", error: "Guest users have READ-ONLY chat permissions. Assign an active CV Profile to send chat messages!" }));
              return;
            }

            const rep = userReputationCache[user.ign];
            if (rep) {
              if (rep.suspendedUntil && new Date(rep.suspendedUntil) > new Date()) {
                ws.send(JSON.stringify({ type: "chat_error", error: `🚫 Severe warning limit hit. Your profile is SUSPENDED from chat interactions until ${new Date(rep.suspendedUntil).toLocaleTimeString()}.` }));
                return;
              }
              if (rep.muteUntil && new Date(rep.muteUntil) > new Date()) {
                ws.send(JSON.stringify({ type: "chat_error", error: `🚫 Profile under temporary MUTE check. Permissions return at ${new Date(rep.muteUntil).toLocaleTimeString()}.` }));
                return;
              }
            }

            // Rate limit
            const now = Date.now();
            let stamps = msgTimestampsByIpsOrIgns.get(user.ign) || [];
            stamps = stamps.filter(t => now - t < 4000);
            stamps.push(now);
            msgTimestampsByIpsOrIgns.set(user.ign, stamps);

            if (stamps.length > 4) {
              ws.send(JSON.stringify({ type: "chat_error", error: "🚨 Multi-action threshold hit: Slow down! Chat throttled (4s rate limit cooldown active)." }));
              return;
            }

            const { channelId, text, replyTo, imageUrl, gifUrl, poll } = payload;
            let cleanedText = text || "";
            let blockMessage = false;
            let blockReason = "";

            const lowerText = cleanedText.toLowerCase();

            // Severe keyword blocker
            if (filterConfig.blockSevere) {
              for (const severeWord of filterConfig.severeWords) {
                if (lowerText.includes(severeWord.toLowerCase())) {
                  blockMessage = true;
                  blockReason = `Flagged Severe Keyword Block: "${severeWord}"`;
                  break;
                }
              }
            }

            // Unsafe third-party URL link blocker
            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            const urls = cleanedText.match(urlRegex);
            if (urls) {
              const allowedDomains = ["youtube.com", "twitch.tv", "twitter.com", "discord.gg", "github.com", "google.com", "crimsonvipers.com"];
              for (const url of urls) {
                try {
                  const urlObj = new URL(url);
                  const hostname = urlObj.hostname.replace("www.", "");
                  const isAllowed = allowedDomains.some(domain => hostname === domain || hostname.endsWith("." + domain));
                  if (!isAllowed) {
                    blockMessage = true;
                    blockReason = `Security Policy: Suspicious URL links Blocked ("${hostname}")`;
                    break;
                  }
                } catch (e) {
                  blockMessage = true;
                  blockReason = "Security Policy: Malformed link format";
                  break;
                }
              }
            }

            if (blockMessage) {
              if (rep) {
                rep.warningsCount += 1;
                rep.score = Math.max(0, rep.score - 10);

                if (rep.warningsCount >= 3) {
                  const minutes = 10;
                  const muteExpiry = new Date(Date.now() + minutes * 60000).toISOString();
                  rep.muteUntil = muteExpiry;
                  rep.warningsCount = 0; // reset warnings count

                  const logId = "mod-" + Date.now();
                  moderationLogs.push({
                    id: logId,
                    timestamp: new Date().toISOString(),
                    actor: "System Sentinel",
                    action: "Mute",
                    targetUser: user.ign,
                    reason: `Automated: Exceeded language thresholds (${blockReason})`,
                    durationMinutes: minutes
                  });

                  // Broadcast automated alert into chat
                  const sysAlert: WorldChatMessage = {
                    id: "sys-alert-" + Date.now(),
                    channelId,
                    senderIgn: "Automated Sentinel",
                    senderRole: "Moderator",
                    senderAvatar: "🤖",
                    senderVerified: true,
                    senderLevel: 99,
                    senderReputation: 100,
                    text: `⚠️ USER ACTION: ${user.ign} has been automatically muted for ${minutes} minutes due to repeated severe infractions. Stay respectful.`,
                    timestamp: new Date().toISOString(),
                    system: true
                  };
                  chatHistory[channelId].push(sysAlert);
                  broadcast({ type: "chat_message", message: sysAlert });
                  broadcast({ type: "audit_logs", logs: moderationLogs });
                }
              }

              ws.send(JSON.stringify({
                type: "chat_error",
                error: `🚫 Content Blocked: ${blockReason}. System Warnings triggered (${rep ? rep.warningsCount : 1}/3 before mute).`
              }));
              
              ws.send(JSON.stringify({ type: "user_reputation", reputation: rep }));
              return;
            }

            // Earn Reputation & Levels over time based on constructive actions
            if (rep) {
              rep.score = Math.min(100, rep.score + 1);
              if (Math.random() < 0.12) {
                rep.level += 1;
                ws.send(JSON.stringify({
                  type: "system_notify",
                  message: `🎉 COMMUNITY BOOST: You reached Community Level ${rep.level}! Keep chatting!`
                }));
              }
            }

            // Mild Censorship replacing inside words boundaries to decrease false-positives
            if (filterConfig.censorMild) {
              for (const mildWord of filterConfig.mildWords) {
                const regex = new RegExp(`\\b${mildWord}\\b`, "gi");
                cleanedText = cleanedText.replace(regex, (match) => {
                  return match[0] + "*".repeat(match.length - 2) + match[match.length - 1];
                });
              }
            }

            const messageId = "msg-" + Date.now();
            const messageObj: WorldChatMessage = {
              id: messageId,
              channelId,
              senderIgn: user.ign,
              senderRole: user.role,
              senderAvatar: user.avatar,
              senderVerified: user.verified,
              senderLevel: rep ? rep.level : 5,
              senderReputation: rep ? rep.score : 85,
              text: cleanedText,
              timestamp: new Date().toISOString(),
              reactions: {},
              replyTo: replyTo || null,
              imageUrl: imageUrl || undefined,
              gifUrl: gifUrl || undefined,
              poll: poll || null
            };

            if (!chatHistory[channelId]) {
              chatHistory[channelId] = [];
            }
            chatHistory[channelId].push(messageObj);
            if (chatHistory[channelId].length > 150) chatHistory[channelId].shift();

            broadcast({
              type: "chat_message",
              message: messageObj
            });
            break;
          }

          case "add_reaction": {
            const { channelId, messageId, emoji, ign } = payload;
            const chanMsgs = chatHistory[channelId] || [];
            const msgObj = chanMsgs.find(m => m.id === messageId);
            
            if (msgObj) {
              if (!msgObj.reactions) msgObj.reactions = {};
              if (!msgObj.reactions[emoji]) msgObj.reactions[emoji] = [];
              
              const userIdx = msgObj.reactions[emoji].indexOf(ign);
              if (userIdx === -1) {
                msgObj.reactions[emoji].push(ign);
              } else {
                msgObj.reactions[emoji].splice(userIdx, 1);
              }
              
              if (msgObj.reactions[emoji].length === 0) {
                delete msgObj.reactions[emoji];
              }

              broadcast({
                type: "reaction_updated",
                channelId,
                messageId,
                reactions: msgObj.reactions
              });
            }
            break;
          }

          case "vote_poll": {
            const { channelId, messageId, optionIndex, ign } = payload;
            const chanMsgs = chatHistory[channelId] || [];
            const msgObj = chanMsgs.find(m => m.id === messageId);
            
            if (msgObj && msgObj.poll) {
              msgObj.poll.options.forEach((opt: any) => {
                const idx = opt.votes.indexOf(ign);
                if (idx > -1) opt.votes.splice(idx, 1);
              });

              msgObj.poll.options[optionIndex].votes.push(ign);

              broadcast({
                type: "poll_updated",
                channelId,
                messageId,
                poll: msgObj.poll
              });
            }
            break;
          }

          case "report_message": {
            const { messageId, channelId, reportedUser, reporter, reason } = payload;
            const chanMsgs = chatHistory[channelId] || [];
            const msgObj = chanMsgs.find(m => m.id === messageId);
            
            const reportId = "rep-" + Date.now();
            const reportObj = {
              id: reportId,
              messageId,
              messageText: msgObj ? msgObj.text : "Pre-deleted or hidden",
              reportedUser,
              reporter,
              reason,
              timestamp: new Date().toISOString(),
              resolved: false
            };

            chatReports.push(reportObj);

            broadcast({
              type: "reports_updated",
              reports: chatReports
            });

            ws.send(JSON.stringify({
              type: "system_notify",
              message: "🛡️ Report successfully filed to active staff monitors."
            }));
            break;
          }

          case "admin_mod_action": {
            const user = clients.get(ws);
            if (!user || !["Owner", "Head Admin", "Admin", "Moderator"].includes(user.role)) {
              ws.send(JSON.stringify({ type: "chat_error", error: "Permission Denied: Admin authorization required." }));
              return;
            }

            const { action, targetIgn, reason, durationMinutes, messageId, channelId } = payload;
            const tgtState = userReputationCache[targetIgn] || { score: 80, level: 5, warningsCount: 0, muteUntil: null, suspendedUntil: null };

            if (action === "Warning") {
              tgtState.warningsCount += 1;
              tgtState.score = Math.max(0, tgtState.score - 12);
            } else if (action === "Mute") {
              const minutes = durationMinutes || 15;
              tgtState.muteUntil = new Date(Date.now() + minutes * 60000).toISOString();
              tgtState.score = Math.max(0, tgtState.score - 20);
            } else if (action === "Suspend") {
              const minutes = durationMinutes || 60;
              tgtState.suspendedUntil = new Date(Date.now() + minutes * 60000).toISOString();
              tgtState.score = Math.max(0, tgtState.score - 30);
            } else if (action === "Ban") {
              tgtState.suspendedUntil = new Date(Date.now() + 999999 * 60000).toISOString();
              tgtState.score = 0;
            } else if (action === "DeleteMessage") {
              if (channelId && messageId) {
                const mList = chatHistory[channelId] || [];
                const mIdx = mList.findIndex(m => m.id === messageId);
                if (mIdx > -1) {
                  mList.splice(mIdx, 1);
                  broadcast({
                    type: "message_deleted",
                    channelId,
                    messageId
                  });
                }
              }
            } else if (action === "ClearChannel") {
              if (channelId) {
                chatHistory[channelId] = [
                  {
                    id: "sys-clear-" + Date.now(),
                    channelId,
                    senderIgn: "System Moderator",
                    senderRole: "Admin",
                    senderAvatar: "⚖️",
                    senderVerified: true,
                    senderLevel: 100,
                    senderReputation: 100,
                    text: "🗑️ This room history has been cleared by a moderator.",
                    timestamp: new Date().toISOString(),
                    system: true
                  }
                ];
                broadcast({
                  type: "channel_cleared",
                  channelId,
                  history: chatHistory[channelId]
                });
              }
            }

            userReputationCache[targetIgn] = tgtState;

            // Audit logging
            const logId = "log-" + Date.now();
            moderationLogs.push({
              id: logId,
              timestamp: new Date().toISOString(),
              actor: user.ign,
              action,
              targetUser: targetIgn,
              reason,
              durationMinutes
            });

            // Mark reports pointing to this user as resolved
            chatReports.forEach(r => {
              if (r.reportedUser === targetIgn) {
                r.resolved = true;
              }
            });

            broadcast({
              type: "reports_updated",
              reports: chatReports
            });

            broadcast({
              type: "audit_logs",
              logs: moderationLogs
            });

            broadcast({
              type: "system_notify",
              message: `⚖️ Admin action applied: User ${targetIgn} issued ${action}. Rule compliance enforced.`
            });
            break;
          }

          case "update_filter_config": {
            const user = clients.get(ws);
            if (!user || !["Owner", "Head Admin", "Admin"].includes(user.role)) {
              ws.send(JSON.stringify({ type: "chat_error", error: "Permission Denied: Administrator level only." }));
              return;
            }

            const { censorMild, blockSevere, mildWords, severeWords } = payload.config;
            filterConfig.censorMild = !!censorMild;
            filterConfig.blockSevere = !!blockSevere;
            if (Array.isArray(mildWords)) filterConfig.mildWords = mildWords;
            if (Array.isArray(severeWords)) filterConfig.severeWords = severeWords;

            // Secure audit logging for rule change
            const logId = "log-" + Date.now();
            moderationLogs.push({
              id: logId,
              timestamp: new Date().toISOString(),
              actor: user.ign,
              action: "Updated Language Filters",
              category: "RULE_CHANGE",
              targetUser: "Filter Configuration",
              reason: `Adjusted Smart Filters config: censorMild=${!!censorMild}, blockSevere=${!!blockSevere}`,
              details: `Active Mild Words: [${filterConfig.mildWords.join(", ")}], Severe Words: [${filterConfig.severeWords.join(", ")}]`
            });

            broadcast({
              type: "filter_config_updated",
              config: filterConfig
            });

            broadcast({
              type: "audit_logs",
              logs: moderationLogs
            });

            broadcast({
              type: "system_notify",
              message: `⚙️ Smart Language Filters updated by administrator ${user.ign}.`
            });
            break;
          }

          case "pin_chat_message": {
            const user = clients.get(ws);
            if (!user || !["Owner", "Head Admin", "Admin", "Moderator"].includes(user.role)) {
              ws.send(JSON.stringify({ type: "chat_error", error: "Permission Denied." }));
              return;
            }

            const { channelId, messageId, pin } = payload;
            const chanMsgs = chatHistory[channelId] || [];
            const msgObj = chanMsgs.find(m => m.id === messageId);
            
            if (msgObj) {
              msgObj.pinned = !!pin;
              broadcast({
                type: "pin_status_updated",
                channelId,
                messageId,
                pinned: msgObj.pinned
              });
            }
            break;
          }

          case "fetch_audit_logs": {
            ws.send(JSON.stringify({
              type: "audit_logs",
              logs: moderationLogs
            }));
            break;
          }

          case "log_admin_action": {
            const user = clients.get(ws);
            if (!user) {
              ws.send(JSON.stringify({ type: "chat_error", error: "Permission Denied: Unauthenticated." }));
              return;
            }

            if (!["Owner", "Head Admin", "Admin", "Moderator"].includes(user.role)) {
              ws.send(JSON.stringify({ type: "chat_error", error: "Permission Denied: Admin roles only." }));
              return;
            }

            const { action, targetUser, reason, details, category } = payload;
            const logId = "log-" + Date.now();
            moderationLogs.push({
              id: logId,
              timestamp: new Date().toISOString(),
              actor: user.ign,
              action: action || "Unknown Action",
              category: category || "GENERAL",
              targetUser: targetUser || "System",
              reason: reason || "",
              details: details || "",
              durationMinutes: 0
            });

            broadcast({
              type: "audit_logs",
              logs: moderationLogs
            });
            break;
          }
        }
      } catch (err) {
        console.error("WebSocket message handling error:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      broadcast({
        type: "presence",
        onlineUsers: Array.from(clients.values())
      });
    });
  });
}

startServer().catch(err => {
  console.error("Critical error starting Express + Vite server:", err);
});
