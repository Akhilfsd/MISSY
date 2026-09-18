export type ValueReminder = { text: string; category: string };

export const VALUE_REMINDERS: ValueReminder[] = [
  { text: "You are valuable even when you feel like you haven't achieved enough.", category: "Self-worth" },
  { text: "You are not a mistake.", category: "Self-worth" },
  { text: "You don't have to become someone else to deserve good things.", category: "Self-respect" },
  { text: "Your presence matters.", category: "Self-worth" },
  { text: "You are allowed to rest.", category: "Rest" },
  { text: "You are stronger than the version of yourself you sometimes see.", category: "Strength" },
  { text: "You don't have to earn your worth.", category: "Self-worth" },
  { text: "You are a diamond, even on the days you cannot see your shine.", category: "Confidence" },
  { text: "Your kindness is valuable.", category: "Self-worth" },
  { text: "Your dreams matter.", category: "Dreams" },
  { text: "Your feelings matter.", category: "Emotional strength" },
  { text: "You deserve peace.", category: "Peace" },
  { text: "You deserve respect.", category: "Self-respect" },
  { text: "You deserve genuine effort.", category: "Self-respect" },
  { text: "You deserve to be understood.", category: "Emotional strength" },
  { text: "You are more capable than you sometimes believe.", category: "Confidence" },
  { text: "Your existence itself has value.", category: "Self-worth" },
  { text: "A slow day is still a day you lived with courage.", category: "Rest" },
  { text: "You are allowed to take up space in your own life.", category: "Self-respect" },
  { text: "Being gentle with yourself is not weakness.", category: "Peace" },
  { text: "You have survived every difficult day so far. That is not a small thing.", category: "Strength" },
  { text: "You don't need permission to protect your peace.", category: "Peace" },
  { text: "Growth is quiet most days. It still counts.", category: "Personal growth" },
  { text: "The way someone treats you is about them, not about your value.", category: "Self-respect" },
  { text: "You are allowed to change your mind and start again.", category: "Personal growth" },
  { text: "Your soft heart is a strength, not a flaw.", category: "Emotional strength" },
  { text: "You are doing better than the story your tired mind is telling you.", category: "Emotional strength" },
  { text: "Small steps still move you forward.", category: "Personal growth" },
  { text: "You don't have to be productive to be worthy.", category: "Rest" },
  { text: "Your health matters as much as your responsibilities.", category: "Life" },
  { text: "You can be scared and still be brave.", category: "Courage" },
  { text: "You are allowed to want a good life.", category: "Dreams" },
  { text: "Happiness is not something you must deserve first.", category: "Happiness" },
  { text: "You are allowed to be proud of yourself today.", category: "Confidence" },
  { text: "Your effort is seen, even when nobody says it out loud.", category: "Strength" },
  { text: "You don't have to carry everything alone.", category: "Emotional strength" },
  { text: "Rest is part of the work, not a break from it.", category: "Rest" },
  { text: "You can outgrow places, habits and people. That is allowed.", category: "Personal growth" },
  { text: "Your calm is worth protecting more than any argument.", category: "Peace" },
  { text: "You are not behind in life. You are simply on your own timing.", category: "Life" },
  { text: "You are becoming someone you would be grateful for.", category: "Personal growth" },
  { text: "Your voice deserves to be heard without shrinking.", category: "Courage" },
  { text: "You are allowed to celebrate small wins loudly.", category: "Happiness" },
  { text: "You don't need to explain your need for rest.", category: "Rest" },
  { text: "Difficult days end. You continue.", category: "Strength" },
  { text: "You are worthy of the same patience you give everyone else.", category: "Self-respect" },
  { text: "Being yourself is enough of a plan for today.", category: "Confidence" },
  { text: "Your future is still full of pages nobody has written yet.", category: "Dreams" },
  { text: "You are more than the hardest thing you are going through.", category: "Strength" },
  { text: "You are allowed to feel joy without guilt.", category: "Happiness" },
  { text: "Peace is not boring. Peace is the reward.", category: "Peace" },
  { text: "You are the kind of person who keeps trying. That is rare.", category: "Courage" },
  { text: "Your tiredness is information, not failure.", category: "Rest" },
  { text: "Life is long enough for you to do the things you want.", category: "Life" },
  { text: "You are becoming stronger in ways you cannot measure yet.", category: "Personal growth" },
  { text: "Your dreams are not too big. They just need time.", category: "Dreams" },
  { text: "You are someone's favourite person, and also your own.", category: "Self-worth" },
  { text: "Nothing about you needs fixing before you can be loved.", category: "Self-worth" },
  { text: "You are allowed to take the easier path sometimes.", category: "Peace" },
  { text: "Today you only have to do today.", category: "Life" },
];

export const VALUE_CATEGORIES = [
  "Self-worth",
  "Confidence",
  "Strength",
  "Peace",
  "Dreams",
  "Life",
  "Personal growth",
  "Self-respect",
  "Courage",
  "Happiness",
  "Rest",
  "Emotional strength",
];

export const CAPABILITY_REMINDERS: string[] = [
  "You are capable of learning.",
  "You are capable of starting again.",
  "You are capable of handling difficult days.",
  "You are capable of building the life you want.",
  "You are capable of becoming better without becoming someone else.",
  "You are stronger than your temporary problems.",
  "You are capable of asking for what you need.",
  "You are capable of changing your routine, slowly.",
  "You are capable of finishing what matters to you.",
  "You are capable of resting without guilt.",
  "You are capable of saying no kindly.",
  "You are capable of understanding hard things if you give yourself time.",
  "You are capable of choosing peace over proving a point.",
  "You are capable of taking care of your health.",
  "You are capable of keeping your own promises to yourself.",
  "You are capable of surviving a bad week.",
  "You are capable of making your own decisions.",
  "You are capable of turning a small idea into something real.",
];

export const PAUSE_MESSAGES: string[] = [
  "Pause.",
  "Breathe.",
  "Look around.",
  "Relax your shoulders.",
  "Drink some water.",
  "Remember where you are now.",
  "Your past is part of your story, not the definition of your future.",
  "Today is still yours.",
  "Unclench your jaw.",
  "Slow down for ten seconds.",
  "Everything will be okay.",
  "You don't have to solve everything today.",
  "Let this moment be easy.",
  "Blink slowly. Rest your eyes.",
  "Nothing urgent is happening right now.",
  "One thing at a time.",
  "You are allowed to stop here for a minute.",
  "Notice one nice thing near you.",
];

export const GENTLE_REMINDERS: { text: string; tag: string }[] = [
  { text: "Pgl, take a sip of water.", tag: "water" },
  { text: "Relax your eyes for a minute.", tag: "eyes" },
  { text: "Check your posture.", tag: "posture" },
  { text: "Take a small breath.", tag: "breathe" },
  { text: "Don't forget to eat.", tag: "food" },
  { text: "It's okay to slow down.", tag: "rest" },
  { text: "Your health matters too.", tag: "rest" },
  { text: "Breathe. One thing at a time.", tag: "breathe" },
  { text: "Everything doesn't have to be solved today.", tag: "rest" },
  { text: "Look at something far away for twenty seconds.", tag: "eyes" },
  { text: "Stretch your hands and neck gently.", tag: "posture" },
  { text: "Have you had something proper to eat?", tag: "food" },
  { text: "Half a glass of water counts too.", tag: "water" },
  { text: "Stand up and walk a few steps.", tag: "posture" },
];

export const DAILY_LINES: string[] = [
  "Today is another day to remember how valuable you are.",
  "A quiet day is still a beautiful day.",
  "Whatever today looks like, you are allowed to be gentle with yourself.",
  "Let today be softer than yesterday.",
  "You don't have to win today. You only have to live it.",
  "Something small and good is waiting for you today.",
  "Today, your peace is the priority.",
  "You woke up, and that is already a good beginning.",
  "Take today slowly. It belongs to you.",
  "Today deserves your kindness, and so do you.",
  "Even ordinary days are building something.",
  "Today is a good day to be proud of how far you've come.",
  "Let today be enough exactly as it is.",
  "There is no rush today. Only care.",
];

export const PERIOD_DAY_CARE: Record<number, string[]> = {
  1: [
    "Rest more than usual, your body is working hard today.",
    "Stay hydrated — warm water or a warm drink can help.",
    "Use warmth for cramps if it feels comfortable.",
    "Eat nourishing food, even small portions.",
    "Take pain relief only if it's what you normally use or what a healthcare professional advised.",
  ],
  2: [
    "Hydration first. Keep a bottle near you.",
    "Proper meals, no skipping.",
    "Iron-rich foods like dates, spinach, lentils or eggs.",
    "Rest whenever your body asks.",
    "Gentle movement if it feels comfortable.",
  ],
  3: [
    "Light walking or stretching if you feel up to it.",
    "Good hydration through the day.",
    "Balanced meals with something warm.",
    "Rest when needed, no guilt.",
  ],
  4: [
    "Continue hydration.",
    "Comfortable clothing, nothing tight.",
    "Personal hygiene and fresh changes.",
    "Rest and easy tasks only.",
  ],
  5: [
    "Continue caring for yourself.",
    "Gradually return to your normal routine if you feel well.",
    "Keep eating properly and drinking water.",
  ],
};

export const PHASE_CARE: Record<string, { title: string; emoji: string; tips: string[] }> = {
  period: {
    title: "Period days",
    emoji: "🌙",
    tips: [
      "Warmth, water and rest are your friends.",
      "Iron-rich and warm foods help energy.",
      "Keep supplies nearby so nothing feels urgent.",
    ],
  },
  follicular: {
    title: "After your period",
    emoji: "🌱",
    tips: [
      "Energy usually returns slowly — use it kindly.",
      "A good time for planning small things.",
      "Keep hydration and meals steady.",
    ],
  },
  ovulation: {
    title: "Mid-cycle",
    emoji: "🌸",
    tips: [
      "You may feel more social and energetic.",
      "Stay hydrated, especially if you are more active.",
      "Light skin care, your skin may be sensitive.",
    ],
  },
  luteal: {
    title: "Before your period",
    emoji: "☁️",
    tips: [
      "Mood changes are normal, be extra gentle with yourself.",
      "Reduce caffeine if you feel restless.",
      "Sleep a little earlier if you can.",
      "Keep period supplies ready in advance.",
    ],
  },
};

export const MEDICAL_FLAGS: string[] = [
  "Pain that is much more severe than your usual",
  "Very heavy bleeding (soaking through protection every hour for several hours)",
  "Fainting, severe dizziness or shortness of breath",
  "Fever alongside period symptoms",
  "Bleeding that lasts much longer than normal for you",
  "Anything that simply feels abnormal for your body",
];

export const PERIOD_CARE_CHECKLIST: string[] = [
  "Drink water",
  "Eat proper meals",
  "Rest when needed",
  "Keep comfortable",
  "Track pain level",
  "Track energy level",
  "Track mood",
  "Track symptoms",
  "Keep necessary period supplies available",
  "Take medicine only according to normal/medical guidance",
];

export const NOTE_CATEGORIES: { key: string; label: string; short: string; icon: string }[] = [
  { key: "low", label: "Read This When You Feel Low", short: "Feeling low", icon: "cloud" },
  { key: "tired", label: "Read This When You Feel Tired", short: "Tired", icon: "moon" },
  { key: "doubt", label: "Read This When You Doubt Yourself", short: "Self-doubt", icon: "mirror" },
  { key: "confidence", label: "Read This When You Need Confidence", short: "Confidence", icon: "star" },
  { key: "lost", label: "Read This When You Feel Lost", short: "Feeling lost", icon: "compass" },
  { key: "peace", label: "Read This When You Need Peace", short: "Peace", icon: "leaf" },
  { key: "smile", label: "Read This When You Need A Smile", short: "A smile", icon: "smile" },
];

export const SEED_NOTES: { category: string; body: string }[] = [
  { category: "low", body: "You don't have to explain why today feels heavy. Put the phone down, drink something warm, and let the day be small. Nothing is wrong with you." },
  { category: "low", body: "Low days lie. They tell you that this is permanent. It isn't. You've come out of this before, and you were still you on the other side." },
  { category: "low", body: "If you can't do anything today except breathe and eat something, that is a full day of work. I mean it." },
  { category: "tired", body: "Tired is not a personality flaw. Close your eyes for ten minutes. The world will wait, I promise." },
  { category: "tired", body: "Your body has carried you through every single day so far without asking for much. Give it water, food and quiet tonight." },
  { category: "tired", body: "You are allowed to do the bare minimum today and call it enough. Tomorrow-you will not be angry." },
  { category: "doubt", body: "You've doubted yourself before big things and then done them anyway. That pattern says more about you than the doubt does." },
  { category: "doubt", body: "The version of you that is unsure right now is the same person who figured things out last time. Nothing has been lost." },
  { category: "doubt", body: "You don't have to feel confident to be capable. Just start badly, then fix it." },
  { category: "confidence", body: "Stand normally, shoulders back, breathe once. You know more than you think you do. Speak like someone who has done the work, because you have." },
  { category: "confidence", body: "You don't need everyone's approval. One honest opinion of yourself is heavier than a hundred careless ones." },
  { category: "lost", body: "Being unsure about the future doesn't mean you're going the wrong way. Most people are just better at pretending." },
  { category: "lost", body: "You don't need the whole map. Just the next honest step. That's how everything gets built." },
  { category: "peace", body: "You are allowed to leave conversations that steal your calm. Peace is not rude." },
  { category: "peace", body: "Put your phone face down. Look out of a window for one minute. That's it, that's the whole task." },
  { category: "smile", body: "Somewhere out there, a very small cat is sleeping in a very sunny square on the floor and thinking about absolutely nothing. Be that today." },
  { category: "smile", body: "You once laughed so hard at something nobody else found funny. That is a superpower, keep it." },
];

export const DEFAULT_CHECKLIST: { part: string; items: string[] }[] = [
  {
    part: "morning",
    items: [
      "Did you sleep properly?",
      "Drink water",
      "Brush gently",
      "Eat breakfast",
      "Take care of your eyes",
      "Take medicines/supplements only if prescribed",
      "Start the day calmly",
    ],
  },
  {
    part: "day",
    items: [
      "Drink enough water",
      "Eat proper food",
      "Take breaks",
      "Take care of your eyes",
      "Complete important work/duty",
      "Take a few peaceful minutes",
      "Don't skip meals",
    ],
  },
  {
    part: "evening",
    items: [
      "Drink water",
      "Eat properly",
      "Take some rest",
      "Reduce unnecessary stress",
      "Spend some time doing something you enjoy",
    ],
  },
  {
    part: "night",
    items: [
      "Keep spectacles safely aside",
      "Give your eyes rest",
      "Put the phone away for some time",
      "Think about one good thing from today",
      "Sleep peacefully",
    ],
  },
];

export const PART_META: Record<string, { label: string; emoji: string; hint: string }> = {
  morning: { label: "Morning", emoji: "🌅", hint: "A calm start is enough." },
  day: { label: "Day", emoji: "☀️", hint: "Small breaks, steady water." },
  evening: { label: "Evening", emoji: "🌇", hint: "Slow down, you did enough." },
  night: { label: "Night", emoji: "🌙", hint: "Rest your eyes and your mind." },
};

export const GOAL_CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: "dream", label: "My Dreams", icon: "sparkle" },
  { key: "goal", label: "My Goals", icon: "target" },
  { key: "learn", label: "I Want To Learn", icon: "book" },
  { key: "visit", label: "Places To Visit", icon: "map" },
  { key: "buy", label: "One Day", icon: "gift" },
  { key: "proud", label: "I Am Proud Of", icon: "star" },
  { key: "improve", label: "Things To Improve", icon: "sprout" },
];

export const EVENT_CATEGORIES = [
  "birthday",
  "appointment",
  "exam",
  "work",
  "personal",
  "monthly",
  "custom",
];

/** Deterministic rotation: walks a full permutation before repeating. */
export function rotate<T>(list: T[], dayIndex: number, offset = 0): T {
  if (list.length === 0) throw new Error("empty list");
  const n = list.length;
  let step = Math.floor(n / 2) + 1;
  while (gcd(step, n) !== 1) step += 1;
  const idx = ((dayIndex + offset) * step) % n;
  return list[((idx % n) + n) % n];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function dayIndexFromKey(dayKey: string): number {
  const [y, m, d] = dayKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / 86400000);
}

export type DailyPack = {
  value: ValueReminder;
  capability: string;
  pause: string;
  line: string;
  gentle: string;
  note: { category: string; body: string } | null;
};

export function buildDailyPack(dayKey: string): DailyPack {
  const i = dayIndexFromKey(dayKey);
  return {
    value: rotate(VALUE_REMINDERS, i),
    capability: rotate(CAPABILITY_REMINDERS, i, 3),
    pause: rotate(PAUSE_MESSAGES, i, 7),
    line: rotate(DAILY_LINES, i, 2),
    gentle: rotate(GENTLE_REMINDERS, i, 5).text,
    note: SEED_NOTES.length ? rotate(SEED_NOTES, i, 11) : null,
  };
}

/* ------------------------------------------------------------------ *
 *  "How Precious You Are, Bba" — her personal value board
 * ------------------------------------------------------------------ */

export type ValueBoardGroup = {
  key: string;
  title: string;
  icon: string;
  tone: "blush" | "lilac" | "sky" | "mint" | "sand" | "rose";
  items: string[];
};

export const VALUE_BOARD: ValueBoardGroup[] = [
  {
    key: "you-are",
    title: "You are…",
    icon: "sparkle",
    tone: "sand",
    items: [
      "Kind — even when you're tired.",
      "Strong — even when you feel weak.",
      "Brave — even when you're scared.",
      "Beautiful — inside and out.",
      "Smart — in ways you don't even realise.",
      "Special — in every little thing you do.",
    ],
  },
  {
    key: "your-heart",
    title: "Your heart…",
    icon: "heart",
    tone: "sky",
    items: [
      "Pure, soft & genuine.",
      "Feels deeply.",
      "Loves unconditionally.",
      "Cares without limits.",
      "Turns small moments into happiness.",
    ],
  },
  {
    key: "you-bring",
    title: "You bring…",
    icon: "flower",
    tone: "blush",
    items: [
      "Calm in my chaos.",
      "Light in my darkest days.",
      "Smiles to my boring days.",
      "Meaning to my life.",
      "So much happiness just by being you.",
    ],
  },
  {
    key: "your-dreams",
    title: "Your dreams…",
    icon: "star",
    tone: "rose",
    items: [
      "Are valid.",
      "Are important.",
      "Are beautiful.",
      "And you deserve every single one of them.",
    ],
  },
  {
    key: "always-remember",
    title: "Always remember…",
    icon: "gem",
    tone: "mint",
    items: [
      "You are not a mistake.",
      "You are not too much.",
      "You are not less.",
      "You are enough.",
      "You are a diamond, and diamonds never lose their shine.",
    ],
  },
  {
    key: "you-deserve",
    title: "You deserve…",
    icon: "shield",
    tone: "lilac",
    items: [
      "Love without guilt.",
      "Peace without fear.",
      "Happiness without limits.",
      "A life that feels good in your heart.",
    ],
  },
];

export const VALUE_BOARD_NOTES = [
  { key: "someone", text: "You are not just someone… you are MY SOMEONE." },
  { key: "lucky", text: "The world is lucky to have you. I am just more lucky to know you." },
  { key: "always", text: "No matter where life takes you, you will always be my special person — today, tomorrow, and always." },
  { key: "sky", text: "Same sky… same love… always." },
];

export const VALUE_BOARD_CENTREPIECE =
  "You are incredibly valuable, beautiful, loved, and irreplaceable.";

/* ------------------------------------------------------------------ *
 *  Pgl's 5-Day Period Care
 * ------------------------------------------------------------------ */

export type PeriodDayPlan = {
  day: number;
  title: string;
  tone: "blush" | "lilac" | "mint" | "sky" | "peach";
  items: string[];
  footer: string;
};

export const PERIOD_5_DAY_PLAN: PeriodDayPlan[] = [
  {
    day: 1,
    title: "Take it easy",
    tone: "blush",
    items: [
      "Rest as much as you can.",
      "Use a warm water bag for stomach cramps (if needed).",
      "Drink warm water / herbal tea (not too hot).",
      "Eat light, nutritious food (dal, soup, khichdi, fruits).",
      "Take pain relief medicine (if needed & as advised).",
      "Keep a positive mindset. You will be okay.",
      "Pray your Salah on time.",
    ],
    footer: "It's okay to slow down.",
  },
  {
    day: 2,
    title: "Stay nourished",
    tone: "lilac",
    items: [
      "Drink plenty of water (aim for 2.5–3L).",
      "Have proper meals, especially iron-rich foods like greens, dates and nuts.",
      "Eat fruits (banana, apple, pomegranate).",
      "Avoid junk, oily and spicy food if possible.",
      "Keep healthy snacks with you (nuts, dates, fruits).",
      "Take medicines/supplements only if prescribed.",
      "Pray your Salah on time.",
    ],
    footer: "Good food = more energy + less discomfort.",
  },
  {
    day: 3,
    title: "Keep moving, a little",
    tone: "mint",
    items: [
      "Do light movement — stretching or a short walk inside.",
      "Sit with good posture, avoid long hours in one position.",
      "Keep drinking water regularly.",
      "Eat balanced meals, don't skip lunch.",
      "Keep your mind calm, avoid overthinking.",
      "Spend a little time reading or relaxing.",
      "Pray your Salah on time.",
    ],
    footer: "Gentle movement = less pain & more comfort.",
  },
  {
    day: 4,
    title: "Care & comfort",
    tone: "sky",
    items: [
      "Continue hydration — water and healthy drinks.",
      "Eat home-cooked, wholesome food.",
      "Use a clean sanitary pad / menstrual cup, change as advised.",
      "Keep the area clean and dry.",
      "Wear comfortable, breathable clothes.",
      "If you feel tired, take short naps.",
      "Pray your Salah on time.",
    ],
    footer: "Comfort is not a luxury — it's a need.",
  },
  {
    day: 5,
    title: "Almost there",
    tone: "peach",
    items: [
      "Stay hydrated till the end.",
      "Eat well, don't skip meals.",
      "Avoid too much screen time, rest your eyes too.",
      "Do something that makes you happy (music, journal, dua).",
      "Be gentle with yourself. You've done so well.",
      "Pray your Salah on time.",
      "Prepare for the next cycle — keep pads, medicines and extra clothes ready.",
    ],
    footer: "You're almost done, Pgl. Keep going.",
  },
];

export const PERIOD_GENERAL_CARE: string[] = [
  "Wear comfortable & clean clothes.",
  "Change pads regularly (every 3–4 hours).",
  "Keep the area clean and dry.",
  "Use mild soap for intimate hygiene.",
  "Avoid heavy work, lifting and strenuous activities.",
  "Get enough sleep (at least 7–8 hours).",
  "Keep your phone away when you need rest.",
  "Talk to someone you trust if you feel low.",
];

export const PERIOD_DOS: string[] = [
  "Eat nutritious food.",
  "Stay hydrated.",
  "Rest and take breaks.",
  "Use a hot water bag if needed.",
  "Keep your room clean and warm.",
  "Be kind to yourself.",
];

export const PERIOD_DONTS: string[] = [
  "Don't skip meals.",
  "Don't use harsh soaps or products.",
  "Don't do heavy exercise.",
  "Don't ignore pain or unusual symptoms.",
  "Don't compare your cycle with others.",
  "Don't stress.",
];

export const PERIOD_DUA = {
  arabic: "رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ",
  transliteration: "Rabbi hab lī min ladunka dhurriyyatan ṭayyibatan innaka samīʿud-duʿāʾ",
  translation:
    "My Lord, grant me from Yourself a good offspring. Indeed, You are the One who hears the prayer.",
  reference: "Surah Āl-ʿImrān 3:38",
};

export const PERIOD_DHIKR = [
  { text: "SubhanAllah", count: "33 times" },
  { text: "Alhamdulillah", count: "33 times" },
  { text: "Allahu Akbar", count: "34 times" },
];

export const PERIOD_CLOSING_NOTE =
  "These 5 days are not a weakness — they are a reminder of your strength, your patience and how beautifully you are made.";

export const PERIOD_BLESSING =
  "May Allah make these days easy for you, and always keep you happy, healthy and in His protection. Ameen.";

/* ------------------------------------------------------------------ *
 *  Evening — duty finished at 6 PM, welcome home
 * ------------------------------------------------------------------ */

export const EVENING_WELCOME: { title: string; body: string }[] = [
  {
    title: "You're home. You can put it all down now.",
    body: "Whatever the day asked of you, you answered it. The rest of this evening belongs to you — no one else.",
  },
  {
    title: "Duty done. Well done, genuinely.",
    body: "You showed up and finished what you started, even on the tiring parts. That deserves more credit than you give yourself.",
  },
  {
    title: "That's enough for today.",
    body: "You don't have to be productive for another minute. Change into something soft, breathe out, let the day end.",
  },
  {
    title: "Welcome home.",
    body: "The hard part of the day is behind you. Warm water, something to eat, and a little quiet — that's the whole plan now.",
  },
  {
    title: "You carried a lot today.",
    body: "Put your bag down, take your shoes off, let your shoulders drop. Nothing urgent is waiting for you here.",
  },
  {
    title: "The day is closing gently.",
    body: "You did what you could with the energy you had, and that is always enough. Rest is the next right thing.",
  },
  {
    title: "Proud of you today.",
    body: "Not for anything big — just for going, doing it, and coming back. That quiet consistency is its own kind of strength.",
  },
  {
    title: "Your evening starts now.",
    body: "No more duty, no more performing. Just you, in your own space, allowed to be completely ordinary.",
  },
];

export const EVENING_UNWIND: string[] = [
  "Drink a full glass of water before anything else.",
  "Change into something comfortable.",
  "Eat something warm, properly, without rushing.",
  "Rest your eyes for ten minutes, screen-free.",
  "Stretch your shoulders and neck slowly.",
  "Pray your Salah calmly, without hurry.",
  "Do one small thing you actually enjoy.",
  "Put the phone down a little earlier tonight.",
];

export const TIRED_COMFORT: string[] = [
  "Being tired is not a failure — it's proof you gave something of yourself today.",
  "You don't have to earn your rest. It's already yours.",
  "Nothing that's left can't wait until tomorrow.",
  "Your body has carried you all day. Be kind to it tonight.",
  "You're allowed to do absolutely nothing for the next hour.",
  "Tomorrow gets a fresh version of you. Tonight just needs a resting one.",
];
