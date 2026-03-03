/**
 * SETU Education Management System - Comprehensive Mock Data
 * Feature Branch: feature/relational-mock-data
 *
 * This file contains all mock data entities with proper relational integrity
 * as specified in the technical specification.
 */

import type {
  Admin,
  Teacher,
  Student,
  Parent,
  Librarian,
  Subject,
  SubjectCategory,
  ClassGrade,
  TimetableEntry,
  SchedulePeriod,
  Attendance,
  Assignment,
  AssignmentSubmission,
  Grade,
  Announcement,
  Message,
  Book,
  LibraryTransaction,
  Ticket,
  Report,
  AuditLog,
  Permission,
  RolePermission,
  AccessConfig,
  Integration,
  SystemUser,
  SearchResult,
  MockDataStore,
} from "../types";
import { DEFAULT_PERMISSIONS } from "./permissions";

// ==================== UTILITY FUNCTIONS ====================

const generateId = (prefix: string, index: number): string => {
  return `${prefix}${index.toString().padStart(3, "0")}`;
};

const generateDate = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const generateDateTime = (
  daysAgo: number = 0,
  hoursAgo: number = 0,
): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString().replace("T", " ").substring(0, 16);
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = <T>(array: T[], count: number): T[] => {
  return shuffleArray(array).slice(0, count);
};

// ==================== DATA COUNTS ====================
const COUNTS = {
  admins: 5,
  teachers: 20,
  students: 150,
  parents: 50,
  librarians: 2,
  subjects: 18,
  classes: 15,
  timetableEntries: 200,
  attendanceRecords: 4500,
  assignments: 55,
  gradeEntries: 520,
  announcements: 35,
  messages: 120,
  books: 100,
  libraryTransactions: 220,
  tickets: 55,
  reports: 25,
  auditLogs: 50,
};

// ==================== NAME DATA ====================
const FIRST_NAMES = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Kimberly",
  "Paul",
  "Emily",
  "Andrew",
  "Donna",
  "Joshua",
  "Michelle",
  "Kenneth",
  "Dorothy",
  "Kevin",
  "Carol",
  "Brian",
  "Amanda",
  "George",
  "Melissa",
  "Timothy",
  "Deborah",
  "Ronald",
  "Stephanie",
  "Edward",
  "Rebecca",
  "Jason",
  "Sharon",
  "Jeffrey",
  "Laura",
  "Ryan",
  "Cynthia",
  "Jacob",
  "Kathleen",
  "Gary",
  "Amy",
  "Nicholas",
  "Angela",
  "Eric",
  "Shirley",
  "Jonathan",
  "Anna",
  "Stephen",
  "Brenda",
  "Larry",
  "Pamela",
  "Justin",
  "Emma",
  "Scott",
  "Nicole",
  "Brandon",
  "Helen",
  "Benjamin",
  "Samantha",
  "Samuel",
  "Katherine",
  "Gregory",
  "Christine",
  "Frank",
  "Debra",
  "Alexander",
  "Rachel",
  "Raymond",
  "Catherine",
  "Patrick",
  "Carolyn",
  "Jack",
  "Janet",
  "Dennis",
  "Ruth",
  "Jerry",
  "Maria",
  "Tyler",
  "Heather",
  "Aaron",
  "Diane",
  "Henry",
  "Virginia",
  "Jose",
  "Julie",
  "Adam",
  "Joyce",
  "Arthur",
  "Victoria",
  "Peter",
  "Olivia",
  "Harold",
  "Kelly",
  "Albert",
  "Christina",
  "Carl",
  "Lauren",
  "Gerald",
  "Joan",
  "Ryan",
  "Evelyn",
  "Roger",
  "Judith",
  "Joe",
  "Megan",
  "Juan",
  "Cheryl",
  "Jack",
  "Andrea",
  "Albert",
  "Hannah",
  "Jonathan",
  "Martha",
  "Justin",
  "Jacqueline",
  "Terry",
  "Frances",
  "Gerald",
  "Gloria",
  "Keith",
  "Ann",
  "Samuel",
  "Teresa",
  "Willie",
  "Kathryn",
  "Ralph",
  "Sara",
  "Lawrence",
  "Janice",
  "Nicholas",
  "Jean",
  "Roy",
  "Alice",
  "Benjamin",
  "Madison",
  "Bruce",
  "Doris",
  "Brandon",
  "Abigail",
  "Adam",
  "Julia",
  "Harry",
  "Judy",
  "Fred",
  "Grace",
  "Wayne",
  "Denise",
  "Billy",
  "Amber",
  "Steve",
  "Marilyn",
  "Louis",
  "Beverly",
  "Jeremy",
  "Danielle",
  "Randy",
  "Theresa",
  "Howard",
  "Sophia",
  "Eugene",
  "Marie",
  "Carlos",
  "Diana",
  "Russell",
  "Brittany",
  "Bobby",
  "Natalie",
  "Victor",
  "Isabella",
  "Martin",
  "Charlotte",
  "Ernest",
  "Rose",
  "Phillip",
  "Alexandra",
  "Craig",
  "Kayla",
  "Alan",
  "Jennifer",
  "Shawn",
  "Lily",
  "Chris",
  "Jane",
  "Earl",
  "Samantha",
  "Jimmy",
  "Katherine",
  "Francis",
  "Tiffany",
  "Dale",
  "Nicole",
  "Cory",
  "Rachel",
  "Manuel",
  "Mia",
  "Rodney",
  "Heather",
  "Curtis",
  "Melissa",
  "Norman",
  "Stephanie",
  "Allen",
  "Nicole",
  "Marvin",
  "Paige",
  "Vincent",
  "Diana",
  "Glenn",
  "Julia",
  "Jeffery",
  "Leslie",
  "Travis",
  "Kathy",
  "Jeff",
  "Theresa",
  "Chad",
  "Andrea",
  "Jacob",
  "Marilyn",
  "Lee",
  "Madison",
  "Melvin",
  "Megan",
  "Alfred",
  "Sandra",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Chavez",
  "Wood",
  "James",
  "Bennett",
  "Gray",
  "Mendoza",
  "Ruiz",
  "Hughes",
  "Price",
  "Alvarez",
  "Castillo",
  "Sanders",
  "Patel",
  "Myers",
  "Long",
  "Ross",
  "Foster",
  "Jimenez",
  "Powell",
  "Jenkins",
  "Perry",
  "Russell",
  "Sullivan",
  "Bell",
  "Coleman",
  "Butler",
  "Henderson",
  "Barnes",
  "Gonzales",
  "Fisher",
  "Vasquez",
  "Simmons",
  "Romero",
  "Jordan",
  "Patterson",
  "Alexander",
  "Hamilton",
  "Graham",
  "Reynolds",
  "Griffin",
  "Wallace",
  "Moreno",
  "West",
  "Cole",
  "Hayes",
  "Bryant",
  "Herrera",
  "Gibson",
  "Ellis",
  "Tran",
  "Medina",
  "Aguilar",
  "Stevens",
  "Murray",
  "Ford",
  "Castro",
  "Marshall",
  "Owens",
  "Harrison",
  "Fernandez",
  "McDonald",
  "Woods",
  "Washington",
  "Kennedy",
  "Wells",
  "Vargas",
  "Henry",
  "Chen",
  "Freeman",
  "Webb",
  "Tucker",
  "Guzman",
  "Burns",
  "Crawford",
  "Olson",
  "Simpson",
  "Porter",
  "Hunter",
  "Gordon",
  "Mendez",
  "Silva",
  "Shaw",
  "Snyder",
  "Mason",
  "Dixon",
  "Munoz",
  "Hunt",
  "Hicks",
  "Holmes",
  "Palmer",
  "Wagner",
  "Black",
  "Robertson",
  "Boyd",
  "Rose",
  "Stone",
  "Salazar",
  "Fox",
  "Warren",
  "Mills",
  "Meyer",
  "Rice",
  "Schmidt",
  "Garza",
  "Daniels",
  "Ferguson",
  "Nichols",
  "Stephens",
  "Soto",
  "Weaver",
  "Ryan",
  "Gardner",
  "Payne",
  "Grant",
  "Dunn",
  "Kelley",
  "Spencer",
  "Hawkins",
  "Arnold",
  "Pierce",
  "Vazquez",
  "Hansen",
  "Peters",
  "Santos",
  "Hart",
  "Bradley",
  "Knight",
  "Elliott",
  "Cunningham",
  "Duncan",
  "Armstrong",
  "Hudson",
  "Carroll",
  "Lane",
  "Riley",
  "Andrews",
  "Alvarado",
  "Ray",
  "Delgado",
  "Berry",
  "Perkins",
  "Hoffman",
  "Johnston",
  "Matthews",
  "Pena",
  "Richards",
  "Contreras",
  "Willis",
  "Carpenter",
  "Lawrence",
  "Sandoval",
  "Guerrero",
  "George",
  "Chapman",
  "Rios",
  "Estrada",
  "Ortega",
  "Watkins",
  "Greene",
  "Nunez",
  "Wheeler",
  "Valdez",
  "Harper",
  "Burke",
  "Larson",
  "Santiago",
  "Maldonado",
  "Morrison",
  "Franklin",
  "Carlson",
  "Austin",
  "Dominguez",
  "Carr",
  "Lawson",
  "Jacobs",
  "OBrien",
  "Lynch",
  "Singh",
  "Vega",
  "Bishop",
  "Montgomery",
  "Oliver",
  "Jensen",
  "Harvey",
  "Williamson",
  "Gilbert",
  "Dean",
  "Sims",
  "Espinoza",
  "Howell",
  "Li",
  "Wong",
  "Reid",
  "Hanson",
  "Le",
  "McCoy",
  "Garrett",
  "Burton",
  "Fuller",
  "Wang",
  "Weber",
  "Welch",
  "Rojas",
  "Lucas",
  "Marquez",
  "Fields",
  "Park",
  "Yang",
  "Little",
  "Banks",
  "Padilla",
  "Day",
  "Walsh",
  "Bowman",
  "Schultz",
  "Luna",
  "Fowler",
  "Mejia",
  "Davidson",
  "Acosta",
  "Brewer",
  "May",
  "Holland",
  "Juarez",
  "Newman",
  "Pearson",
  "Curtis",
  "Cortez",
  "Douglas",
  "Schneider",
  "Joseph",
  "Barrett",
  "Navarro",
  "Figueroa",
  "Keller",
  "Avila",
  "Wade",
  "Molina",
  "Stanley",
  "Hopkins",
  "Campos",
  "Barnett",
  "Bates",
  "Chambers",
  "Orozco",
  "Pacheco",
  "Wheeler",
  "Harrison",
  "Tucker",
  "Glover",
  "Oconnor",
  "Stokes",
  "Powers",
  "Graves",
  "Fitzgerald",
  "Lloyd",
  "Fleming",
  "Velez",
  "Farmer",
  "Hale",
  "Richmond",
  "Moran",
  "Tapia",
  "Huff",
  "Santana",
  "Proctor",
  "Dickson",
  "Merritt",
  "Walls",
  "Blair",
  "Duarte",
  "Sloan",
  "Durham",
  "Chan",
  "Villanueva",
  "Odonnell",
  "Humphrey",
  "Mercado",
  "Head",
  "McBride",
  "Hendricks",
  "Pruitt",
  "Gillespie",
  "Bentley",
  "McMahon",
  "Buchanan",
  "Morin",
  "Walter",
  "Pace",
  "Donovan",
  "Bass",
  "Marsh",
  "McClure",
  "Dougherty",
  "Zuniga",
  "Potts",
  "Randolph",
  "Stout",
  "Lott",
  "Bartlett",
  "Bowers",
  "Obrien",
  "Floyd",
  "Villareal",
  "Brennan",
  "Jefferson",
  "York",
  "Callahan",
  "Ayala",
  "Blackburn",
  "Chaney",
  "Russo",
  "Salinas",
  "Winters",
  "Deleon",
  "Hanna",
  "Sexton",
  "Church",
  "Oneal",
  "Bernal",
  "Benton",
  "Hogan",
  "Hess",
  "Riddle",
  "Hutchinson",
  "Conley",
  "Singleton",
  "French",
  "Good",
  "Mays",
  "Potter",
  "Sparks",
  "Patrick",
  "Gould",
  "David",
  "Combs",
  "Kline",
  "Koch",
  "Madden",
  "Fry",
  "Roth",
  "Conrad",
  "Schmitt",
];

const DEPARTMENTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "Art",
  "Music",
  "Physical Education",
  "Library Science",
  "Administration",
  "IT",
  "Front Office",
  "Counseling",
  "Special Education",
];

const SUBJECT_NAMES = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English Literature",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Economics",
  "Psychology",
  "Sociology",
  "Philosophy",
  "French",
  "Spanish",
  "German",
  "Latin",
  "Statistics",
  "Calculus",
  "Algebra",
  "Geometry",
  "Trigonometry",
];

const BOOK_CATEGORIES = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Geography",
  "Art",
  "Music",
  "Reference",
  "Encyclopedia",
  "Dictionary",
  "Novel",
  "Poetry",
  "Science Fiction",
  "Biography",
  "Philosophy",
  "Economics",
  "Psychology",
];

const TICKET_CATEGORIES: Array<
  "it" | "facility" | "academic" | "admin" | "other"
> = ["it", "facility", "academic", "admin", "other"];

const TICKET_PRIORITIES: Array<"low" | "medium" | "high" | "critical"> = [
  "low",
  "medium",
  "high",
  "critical",
];

// ==================== GENERATION FUNCTIONS ====================

const generateAdmins = (count: number): Admin[] => {
  const admins: Admin[] = [];
  const adminLevels: Array<"super" | "department" | "staff"> = [
    "super",
    "department",
    "staff",
  ];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const id = generateId("adm", i + 1);
    const userId = generateId("usr", i + 1);

    admins.push({
      id,
      userId,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@setu.edu`,
      department: DEPARTMENTS[Math.floor(Math.random() * 5) + 14], // Admin departments
      position: [
        "Principal",
        "Vice Principal",
        "Administrator",
        "IT Manager",
        "Department Head",
      ][i % 5],
      adminLevel: adminLevels[i % 3],
      permissions: ["*"],
      createdAt: generateDate(365 + i * 30),
      lastLogin: generateDateTime(1, i * 2),
    });
  }

  return admins;
};

const generateTeachers = (count: number): Teacher[] => {
  const teachers: Teacher[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[(i + 100) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i + 50) % LAST_NAMES.length];
    const id = generateId("tch", i + 1);
    const userId = generateId("usr", i + 6);

    teachers.push({
      id,
      userId,
      employeeId: `EMP${(2021001 + i).toString()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@setu.edu`,
      phone: `+1 (555) ${String(100 + i).padStart(3, "0")}-${String(1000 + i).slice(1)}`,
      department: DEPARTMENTS[i % 10],
      subjects: [], // Will be populated later
      classes: [], // Will be populated later
      isHeadOfSubject: null, // Will be set for 3 teachers
      isClassTeacher: null, // Will be set later
      qualifications: ["B.Ed", "M.Ed"],
      experience: Math.floor(Math.random() * 15) + 1,
      status: "active",
      joinDate: generateDate(200 + i * 10),
    });
  }

  return teachers;
};

const generateStudents = (count: number): Student[] => {
  const students: Student[] = [];
  const genders = ["male", "female", "other"] as const;
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[(i + 200) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i + 100) % LAST_NAMES.length];
    const id = generateId("std", i + 1);
    const userId = generateId("usr", i + 26);

    // Generate date of birth (ages 12-18)
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - (12 + Math.floor(Math.random() * 7)));
    dob.setMonth(Math.floor(Math.random() * 12));
    dob.setDate(Math.floor(Math.random() * 28) + 1);

    students.push({
      id,
      userId,
      studentId: `STU${(2025001 + i).toString()}`,
      admissionNo: `ADM${(25001 + i).toString()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.setu.edu`,
      phone: `+1 (555) ${String(200 + (i % 100)).padStart(3, "0")}-${String(1000 + (i % 1000)).slice(1)}`,
      dateOfBirth: dob.toISOString().split("T")[0],
      gender: genders[i % 3],
      address: `${100 + i} Education Lane, Academic City, AC ${10000 + i}`,
      classId: "", // Will be populated later
      section: ["A", "B", "C"][i % 3],
      rollNo: i + 1,
      house: ["Phoenix", "Dragon", "Tiger", "Eagle"][i % 4],
      bloodGroup: bloodGroups[i % 8],
      emergencyContact: ["Father", "Mother", "Guardian"][i % 3],
      emergencyPhone: `+1 (555) ${String(300 + (i % 100)).padStart(3, "0")}-${String(1000 + (i % 1000)).slice(1)}`,
      photo: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      attendancePercent: Math.floor(Math.random() * 30) + 70,
      gpa: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      status: "active",
      admissionDate: generateDate(100 + i),
      parentId: null, // Will be populated later
    });
  }

  return students;
};

const generateParents = (count: number): Parent[] => {
  const parents: Parent[] = [];
  const occupations = [
    "Doctor",
    "Engineer",
    "Teacher",
    "Business Owner",
    "Lawyer",
    "Accountant",
    "Manager",
    "Consultant",
    "Nurse",
    "Architect",
  ];
  const relationships = ["father", "mother", "guardian"] as const;

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[(i + 300) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i + 150) % LAST_NAMES.length];
    const id = generateId("par", i + 1);
    const userId = generateId("usr", i + 176);

    parents.push({
      id,
      userId,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+1 (555) ${String(400 + (i % 100)).padStart(3, "0")}-${String(1000 + (i % 1000)).slice(1)}`,
      occupation: occupations[i % occupations.length],
      address: `${200 + i} Parent Street, Residential Area, RA ${20000 + i}`,
      relationship: relationships[i % 3],
      children: [], // Will be populated later
      isAllowedToBorrow: false, // Parents blocked by default
      canSubmitTickets: false, // Parents blocked by default
    });
  }

  return parents;
};

const generateLibrarians = (count: number): Librarian[] => {
  const librarians: Librarian[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[(i + 350) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i + 200) % LAST_NAMES.length];
    const id = generateId("lib", i + 1);
    const userId = generateId("usr", i + 226);

    librarians.push({
      id,
      userId,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@setu.edu`,
      phone: `+1 (555) ${String(500 + i).padStart(3, "0")}-${String(1000 + i).slice(1)}`,
      department: "Library Science",
      librarySection: [
        "Reference",
        "Fiction",
        "Periodicals",
        "Digital Resources",
      ][i % 4],
      status: "active",
      canManageStudentAccess: true,
    });
  }

  return librarians;
};

// ==================== SUBJECT CATEGORIES ====================
// Added by Kilo Code for Phase 6: Subject Category Management

export const subjectCategories: SubjectCategory[] = [
  {
    id: "cat-001",
    name: "Sciences",
    description: "Natural sciences including Physics, Chemistry, and Biology",
    colorCode: "#10B981", // Emerald green
    icon: "flask",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-002",
    name: "Mathematics",
    description:
      "Mathematical subjects including Algebra, Geometry, and Calculus",
    colorCode: "#3B82F6", // Blue
    icon: "calculator",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-003",
    name: "Humanities",
    description: "Social sciences, History, Geography, and related subjects",
    colorCode: "#F59E0B", // Amber
    icon: "book",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-004",
    name: "Languages",
    description: "Language and literature subjects",
    colorCode: "#8B5CF6", // Violet
    icon: "languages",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-005",
    name: "Arts",
    description: "Creative arts including Visual Arts, Music, and Drama",
    colorCode: "#EC4899", // Pink
    icon: "palette",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-006",
    name: "Physical Education",
    description: "Sports, health, and physical fitness subjects",
    colorCode: "#EF4444", // Red
    icon: "dumbbell",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cat-007",
    name: "Technology",
    description: "Computer science, IT, and technical subjects",
    colorCode: "#06B6D4", // Cyan
    icon: "computer",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

// Category mapping for subjects based on subject name
const getCategoryForSubject = (subjectName: string): string | null => {
  const name = subjectName.toLowerCase();

  // Sciences
  if (
    name.includes("physics") ||
    name.includes("chemistry") ||
    name.includes("biology") ||
    name.includes("science")
  ) {
    return "cat-001";
  }

  // Mathematics
  if (
    name.includes("mathematics") ||
    name.includes("math") ||
    name.includes("algebra") ||
    name.includes("geometry") ||
    name.includes("calculus") ||
    name.includes("trigonometry")
  ) {
    return "cat-002";
  }

  // Humanities
  if (
    name.includes("history") ||
    name.includes("geography") ||
    name.includes("civics") ||
    name.includes("economics") ||
    name.includes("psychology") ||
    name.includes("sociology")
  ) {
    return "cat-003";
  }

  // Languages
  if (
    name.includes("english") ||
    name.includes("literature") ||
    name.includes("language") ||
    name.includes("french") ||
    name.includes("spanish") ||
    name.includes("german")
  ) {
    return "cat-004";
  }

  // Arts
  if (
    name.includes("art") ||
    name.includes("music") ||
    name.includes("drama")
  ) {
    return "cat-005";
  }

  // Physical Education
  if (
    name.includes("physical") ||
    name.includes("pe") ||
    name.includes("sports") ||
    name.includes("health")
  ) {
    return "cat-006";
  }

  // Technology
  if (
    name.includes("computer") ||
    name.includes("programming") ||
    name.includes("it") ||
    name.includes("technology") ||
    name.includes("coding")
  ) {
    return "cat-007";
  }

  // Return null for uncategorized subjects (some subjects intentionally uncategorized)
  return null;
};

const generateSubjects = (count: number): Subject[] => {
  const subjects: Subject[] = [];

  for (let i = 0; i < count; i++) {
    const subjectName = SUBJECT_NAMES[i % SUBJECT_NAMES.length];
    const id = generateId("sub", i + 1);

    subjects.push({
      id,
      name: subjectName,
      code: `${subjectName.substring(0, 3).toUpperCase()}${101 + i}`,
      department: DEPARTMENTS[i % 10],
      description: `${subjectName} course covering fundamental concepts and advanced topics.`,
      credits: Math.floor(Math.random() * 3) + 1,
      headTeacherId: null, // Will be set for 3 subjects
      curriculum: `Standard ${subjectName} curriculum for academic year 2025-26`,
      textbook: `${subjectName} Textbook, 5th Edition`,
      learningObjectives: [
        `Understand core ${subjectName} concepts`,
        `Apply ${subjectName} principles to real-world problems`,
        `Develop critical thinking in ${subjectName}`,
        "Complete practical assignments and projects",
      ],
      classes: [], // Will be populated later
      teachers: [], // Will be populated later
      status: "active",
      categoryId: getCategoryForSubject(subjectName),
    });
  }

  return subjects;
};

const generateClasses = (count: number): ClassGrade[] => {
  const classes: ClassGrade[] = [];
  const sections = ["A", "B", "C"];

  for (let i = 0; i < count; i++) {
    const level = Math.floor(i / 3) + 7; // Grades 7-12
    const section = sections[i % 3];
    const id = generateId("cls", i + 1);

    classes.push({
      id,
      name: `Grade ${level}-${section}`,
      level,
      section,
      classTeacherId: null, // Will be populated later
      students: [], // Will be populated later
      subjects: [], // Will be populated later
      room: `${100 + i}`,
      capacity: 30,
      academicYear: "2025-26",
      status: "active",
    });
  }

  return classes;
};

const generateTimetable = (
  count: number,
  classes: ClassGrade[],
  subjects: Subject[],
  teachers: Teacher[],
): TimetableEntry[] => {
  const timetable: TimetableEntry[] = [];
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const timeSlots = [
    "8:00 - 8:45",
    "8:50 - 9:35",
    "9:40 - 10:25",
    "10:40 - 11:25",
    "11:30 - 12:15",
    "1:00 - 1:45",
    "1:50 - 2:35",
    "2:40 - 3:25",
  ];

  let entryCount = 0;

  for (const cls of classes) {
    for (const day of daysOfWeek) {
      for (let p = 0; p < periods.length; p++) {
        if (entryCount >= count) break;

        // Skip some periods for breaks
        if (p === 3) continue; // Break after period 3

        const subject = subjects[entryCount % subjects.length];
        const teacher = teachers[entryCount % teachers.length];
        const [startTime, endTime] = timeSlots[p].split(" - ");

        timetable.push({
          id: generateId("ttb", entryCount + 1),
          classId: cls.id,
          subjectId: subject.id,
          teacherId: teacher.id,
          dayOfWeek: day,
          period: periods[p],
          startTime,
          endTime,
          room: `${100 + (entryCount % 50)}`,
          academicYear: "2025-26",
          notes:
            Math.random() > 0.8 ? "Special notes for this session" : undefined,
        });

        entryCount++;
      }
    }
  }

  return timetable;
};

const generateSchedulePeriods = (): SchedulePeriod[] => {
  return [
    {
      id: "prd001",
      period: 1,
      startTime: "8:00",
      endTime: "8:45",
      breakDuration: 5,
    },
    {
      id: "prd002",
      period: 2,
      startTime: "8:50",
      endTime: "9:35",
      breakDuration: 5,
    },
    {
      id: "prd003",
      period: 3,
      startTime: "9:40",
      endTime: "10:25",
      breakDuration: 15,
    },
    {
      id: "prd004",
      period: 4,
      startTime: "10:40",
      endTime: "11:25",
      breakDuration: 5,
    },
    {
      id: "prd005",
      period: 5,
      startTime: "11:30",
      endTime: "12:15",
      breakDuration: 45,
    },
    {
      id: "prd006",
      period: 6,
      startTime: "13:00",
      endTime: "13:45",
      breakDuration: 5,
    },
    {
      id: "prd007",
      period: 7,
      startTime: "13:50",
      endTime: "14:35",
      breakDuration: 5,
    },
    {
      id: "prd008",
      period: 8,
      startTime: "14:40",
      endTime: "15:25",
      breakDuration: 0,
    },
  ];
};

const generateAttendance = (
  count: number,
  students: Student[],
  classes: ClassGrade[],
  teachers: Teacher[],
): Attendance[] => {
  const attendance: Attendance[] = [];
  const statuses: Array<"present" | "absent" | "late" | "excused"> = [
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "present",
    "absent",
    "late",
    "excused",
  ];

  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    dates.push(generateDate(i));
  }

  let recordCount = 0;

  for (const date of dates) {
    for (const student of students) {
      if (recordCount >= count) break;

      const cls = classes.find((c) => c.id === student.classId) || classes[0];
      const teacher = teachers[recordCount % teachers.length];
      const status = getRandomElement(statuses);

      attendance.push({
        id: generateId("att", recordCount + 1),
        studentId: student.id,
        classId: cls.id,
        date,
        status,
        period: Math.floor(Math.random() * 8) + 1,
        markedBy: teacher.id,
        remarks:
          status !== "present"
            ? `${status.charAt(0).toUpperCase() + status.slice(1)} from class`
            : undefined,
      });

      recordCount++;
    }
  }

  return attendance;
};

const generateAssignments = (
  count: number,
  subjects: Subject[],
  classes: ClassGrade[],
  teachers: Teacher[],
): Assignment[] => {
  const assignments: Assignment[] = [];
  const statuses: Array<"draft" | "published" | "graded" | "archived"> = [
    "published",
    "published",
    "published",
    "graded",
    "archived",
  ];

  const assignmentTitles = [
    "Problem Set",
    "Lab Report",
    "Essay",
    "Worksheet",
    "Project",
    "Research Paper",
    "Presentation",
    "Quiz",
    "Test",
    "Case Study",
    "Group Project",
    "Individual Assignment",
    "Reading Assignment",
    "Practical Exercise",
  ];

  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length];
    const cls = classes[i % classes.length];
    const teacher = teachers[i % teachers.length];
    const status = getRandomElement(statuses);

    assignments.push({
      id: generateId("asm", i + 1),
      title: `${subject.name} ${assignmentTitles[i % assignmentTitles.length]} ${i + 1}`,
      description: `Complete the ${assignmentTitles[i % assignmentTitles.length].toLowerCase()} for ${subject.name}. Follow the guidelines provided in class.`,
      subjectId: subject.id,
      classId: cls.id,
      teacherId: teacher.id,
      dueDate: generateDate(Math.floor(Math.random() * 30)),
      totalMarks: [10, 20, 25, 50, 100][i % 5],
      status,
      attachments:
        Math.random() > 0.5 ? [`assignment_${i + 1}.pdf`] : undefined,
      createdAt: generateDate(30 + i),
      submissions: [],
    });
  }

  return assignments;
};

const generateSubmissions = (
  assignments: Assignment[],
  students: Student[],
): AssignmentSubmission[] => {
  const submissions: AssignmentSubmission[] = [];
  let submissionCount = 0;

  for (const assignment of assignments) {
    const classStudents = students.filter(
      (s) => s.classId === assignment.classId,
    );

    for (const student of classStudents.slice(
      0,
      Math.min(classStudents.length, 25),
    )) {
      if (Math.random() > 0.3) {
        // 70% submission rate
        const isGraded = assignment.status === "graded" && Math.random() > 0.2;
        const marks = isGraded
          ? Math.floor(Math.random() * assignment.totalMarks * 0.3) +
            Math.floor(assignment.totalMarks * 0.5)
          : null;

        submissions.push({
          id: generateId("sub", submissionCount + 1),
          assignmentId: assignment.id,
          studentId: student.id,
          submittedAt: generateDateTime(Math.floor(Math.random() * 10)),
          marks,
          grade:
            marks !== null
              ? ["A", "B", "C", "D"][
                  Math.floor((marks / assignment.totalMarks) * 4)
                ]
              : null,
          feedback: isGraded ? "Good work! Keep improving." : "",
          status: isGraded ? "graded" : "submitted",
        });

        submissionCount++;
      }
    }
  }

  return submissions;
};

const generateGrades = (
  count: number,
  students: Student[],
  subjects: Subject[],
  classes: ClassGrade[],
  teachers: Teacher[],
): Grade[] => {
  const grades: Grade[] = [];
  const terms = ["Term 1", "Term 2", "Midterm", "Final"];

  for (let i = 0; i < count; i++) {
    const student = students[i % students.length];
    const subject = subjects[i % subjects.length];
    const cls = classes.find((c) => c.id === student.classId) || classes[0];
    const teacher = teachers[i % teachers.length];
    const maxMarks = [100, 50, 25, 20][i % 4];
    const marks =
      Math.floor(Math.random() * maxMarks * 0.4) + Math.floor(maxMarks * 0.5);
    const percentage = (marks / maxMarks) * 100;

    let grade: string;
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 85) grade = "A";
    else if (percentage >= 80) grade = "A-";
    else if (percentage >= 75) grade = "B+";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 65) grade = "B-";
    else if (percentage >= 60) grade = "C+";
    else if (percentage >= 55) grade = "C";
    else if (percentage >= 50) grade = "C-";
    else if (percentage >= 45) grade = "D+";
    else if (percentage >= 40) grade = "D";
    else grade = "F";

    grades.push({
      id: generateId("grd", i + 1),
      studentId: student.id,
      subjectId: subject.id,
      classId: cls.id,
      teacherId: teacher.id,
      term: terms[i % terms.length],
      marks,
      maxMarks,
      percentage: parseFloat(percentage.toFixed(2)),
      grade,
      remarks:
        percentage >= 80
          ? "Excellent performance"
          : percentage >= 60
            ? "Good work"
            : "Needs improvement",
      createdAt: generateDate(10 + i),
    });
  }

  return grades;
};

const generateAnnouncements = (
  count: number,
  admins: Admin[],
  teachers: Teacher[],
): Announcement[] => {
  const announcements: Announcement[] = [];
  const targetTypes: Array<"all" | "class" | "teacher" | "student" | "parent"> =
    ["all", "all", "student", "teacher", "parent"];

  const announcementTitles = [
    "Important Update",
    "Schedule Change",
    "Event Reminder",
    "Policy Update",
    "Holiday Notice",
    "Exam Schedule",
    "Parent Meeting",
    "Sports Day",
    "Annual Day",
    "Science Fair",
    "Cultural Festival",
    "Workshop Announcement",
  ];

  for (let i = 0; i < count; i++) {
    const author =
      i % 3 === 0 ? admins[i % admins.length] : teachers[i % teachers.length];
    const targetType = getRandomElement(targetTypes);

    announcements.push({
      id: generateId("ann", i + 1),
      title: `${announcementTitles[i % announcementTitles.length]} - ${i + 1}`,
      message: `This is an important announcement regarding ${announcementTitles[i % announcementTitles.length].toLowerCase()}. Please take note of the details and act accordingly. For more information, contact the administration office.`,
      authorId: author.id,
      targetType,
      targetIds: targetType === "all" ? [] : [`target_${i}`],
      publishType: "immediate",
      status: "published",
      createdAt: generateDate(i * 2),
    });
  }

  return announcements;
};

const generateMessages = (
  count: number,
  students: Student[],
  teachers: Teacher[],
  parents: Parent[],
  classes: ClassGrade[],
): Message[] => {
  const messages: Message[] = [];

  const messageTitles = [
    "Question about assignment",
    "Request for meeting",
    "Update on progress",
    "Feedback needed",
    "Important information",
    "Reminder",
    "Thank you note",
    "Clarification needed",
    "Schedule discussion",
    "Performance review",
  ];

  for (let i = 0; i < count; i++) {
    const isTeacherToStudent = i % 3 === 0;
    const isTeacherToParent = i % 3 === 1;

    let sender: { id: string; name: string; role: any };
    let recipient: { id: string; name: string; role: any };
    let isValid = true;
    let validationNote = "";

    if (isTeacherToStudent) {
      const teacher = teachers[i % teachers.length];
      const student = students[i % students.length];
      // Check if teacher teaches this student
      const cls = classes.find((c) => c.id === student.classId);
      const teacherTeachesClass = cls
        ? teacher.classes.includes(cls.id)
        : false;

      sender = { id: teacher.id, name: teacher.name, role: "teacher" as const };
      recipient = {
        id: student.id,
        name: student.name,
        role: "student" as const,
      };
      isValid = teacherTeachesClass;
      validationNote = teacherTeachesClass
        ? ""
        : "Teacher not allocated to student's class";
    } else if (isTeacherToParent) {
      const teacher = teachers[i % teachers.length];
      const parent = parents[i % parents.length];

      sender = { id: teacher.id, name: teacher.name, role: "teacher" as const };
      recipient = { id: parent.id, name: parent.name, role: "parent" as const };
    } else {
      const student = students[i % students.length];
      const teacher = teachers[i % teachers.length];

      sender = { id: student.id, name: student.name, role: "student" as const };
      recipient = {
        id: teacher.id,
        name: teacher.name,
        role: "teacher" as const,
      };
    }

    messages.push({
      id: generateId("msg", i + 1),
      senderId: sender.id,
      senderRole: sender.role,
      senderName: sender.name,
      recipientId: recipient.id,
      recipientRole: recipient.role,
      recipientName: recipient.name,
      classId: isTeacherToStudent
        ? students[i % students.length].classId
        : undefined,
      subject: "General",
      title: messageTitles[i % messageTitles.length],
      content: `This is a message regarding ${messageTitles[i % messageTitles.length].toLowerCase()}. Please respond at your earliest convenience.`,
      read: Math.random() > 0.5,
      createdAt: generateDateTime(Math.floor(Math.random() * 30)),
      isValid,
      validationNote,
    });
  }

  return messages;
};

const generateBooks = (count: number): Book[] => {
  const books: Book[] = [];

  const bookTitles = [
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      publisher: "MIT Press",
    },
    {
      title: "Physics for Scientists and Engineers",
      author: "Raymond Serway",
      publisher: "Cengage",
    },
    {
      title: "Chemistry: The Central Science",
      author: "Theodore Brown",
      publisher: "Pearson",
    },
    { title: "Biology", author: "Campbell", publisher: "Pearson" },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publisher: "Scribner",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      publisher: "HarperCollins",
    },
    { title: "1984", author: "George Orwell", publisher: "Penguin" },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      publisher: "Penguin",
    },
    {
      title: "History of the World",
      author: "J.M. Roberts",
      publisher: "Oxford",
    },
    {
      title: "World Geography",
      author: "Richard H. Jackson",
      publisher: "McGraw-Hill",
    },
  ];

  for (let i = 0; i < count; i++) {
    const bookTemplate = bookTitles[i % bookTitles.length];
    const totalCopies = Math.floor(Math.random() * 10) + 3;
    const availableCopies = Math.floor(Math.random() * totalCopies);

    books.push({
      id: generateId("bok", i + 1),
      isbn: `978-${String(1000000000 + i).slice(1)}`,
      title: `${bookTemplate.title} ${i > 9 ? `Vol ${Math.floor(i / 10) + 1}` : ""}`,
      author: bookTemplate.author,
      publisher: bookTemplate.publisher,
      category: BOOK_CATEGORIES[i % BOOK_CATEGORIES.length],
      shelfLocation: `${["A", "B", "C", "D", "E"][i % 5]}-${String(100 + (i % 100)).padStart(3, "0")}`,
      totalCopies,
      availableCopies,
      status: availableCopies > 0 ? "available" : "unavailable",
      publishedYear: 1990 + (i % 35),
    });
  }

  return books;
};

const generateLibraryTransactions = (
  count: number,
  books: Book[],
  students: Student[],
): LibraryTransaction[] => {
  const transactions: LibraryTransaction[] = [];
  const statuses: Array<"borrowed" | "returned" | "overdue" | "lost"> = [
    "returned",
    "returned",
    "returned",
    "returned",
    "borrowed",
    "overdue",
  ];

  for (let i = 0; i < count; i++) {
    const book = books[i % books.length];
    const student = students[i % students.length];
    const status = getRandomElement(statuses);
    const borrowedDate = generateDate(Math.floor(Math.random() * 60) + 1);
    const dueDate = new Date(
      new Date(borrowedDate).getTime() + 14 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];

    let returnedDate: string | null = null;
    let lateFine = 0;

    if (status === "returned") {
      returnedDate = new Date(
        new Date(dueDate).getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0];
    } else if (status === "overdue") {
      lateFine = Math.floor(Math.random() * 50) + 5;
    }

    transactions.push({
      id: generateId("trn", i + 1),
      bookId: book.id,
      studentId: student.id,
      borrowedDate,
      dueDate,
      returnedDate,
      status,
      lateFine,
    });
  }

  return transactions;
};

const generateTickets = (
  count: number,
  admins: Admin[],
  teachers: Teacher[],
  students: Student[],
  parents: Parent[],
): Ticket[] => {
  const tickets: Ticket[] = [];

  const ticketTitles = [
    "Login Issue",
    "Password Reset",
    "Software Installation",
    "Hardware Problem",
    "Classroom Equipment",
    "Grading Query",
    "Attendance Correction",
    "Schedule Conflict",
    "Library Access",
    "ID Card Issue",
    "Transport Query",
    "Canteen Issue",
    "Fee Payment",
    "Scholarship Query",
    "Event Registration",
    "Certificate Request",
  ];

  for (let i = 0; i < count; i++) {
    // Parents should NOT be able to create tickets
    const creatorTypes = ["admin", "teacher", "student"] as const;
    const creatorType = creatorTypes[i % creatorTypes.length];

    let createdBy: string;
    let createdByRole: (typeof creatorTypes)[number];

    switch (creatorType) {
      case "admin":
        createdBy = admins[i % admins.length].id;
        createdByRole = "admin";
        break;
      case "teacher":
        createdBy = teachers[i % teachers.length].id;
        createdByRole = "teacher";
        break;
      default:
        createdBy = students[i % students.length].id;
        createdByRole = "student";
    }

    const status: Array<"open" | "in_progress" | "resolved" | "closed"> = [
      "open",
      "in_progress",
      "resolved",
      "closed",
    ];
    const ticketStatus = status[i % status.length];

    tickets.push({
      id: generateId("tkt", i + 1),
      title: ticketTitles[i % ticketTitles.length],
      description: `Detailed description of the ${ticketTitles[i % ticketTitles.length].toLowerCase()} issue. Please resolve as soon as possible.`,
      category: TICKET_CATEGORIES[i % TICKET_CATEGORIES.length],
      priority: TICKET_PRIORITIES[i % TICKET_PRIORITIES.length],
      status: ticketStatus,
      createdBy,
      createdByRole,
      assignedTo: admins[i % admins.length].id,
      createdAt: generateDateTime(i * 2),
      resolvedAt:
        ticketStatus === "resolved" || ticketStatus === "closed"
          ? generateDateTime(Math.max(0, i * 2 - 1))
          : undefined,
      isBlocked: false,
      blockNote: "",
    });
  }

  return tickets;
};

const generateReports = (
  count: number,
  admins: Admin[],
  teachers: Teacher[],
): Report[] => {
  const reports: Report[] = [];
  const types: Array<"student" | "class" | "attendance" | "grade" | "library"> =
    ["student", "class", "attendance", "grade", "library"];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const generator =
      i % 2 === 0 ? admins[i % admins.length] : teachers[i % teachers.length];

    reports.push({
      id: generateId("rpt", i + 1),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${generateDate(i * 5)}`,
      generatedBy: generator.id,
      data: {
        summary: `Comprehensive ${type} analysis for the current academic period`,
        metrics: {
          total: Math.floor(Math.random() * 100),
          average: Math.floor(Math.random() * 100),
        },
        trends: ["increasing", "stable", "decreasing"][i % 3],
      },
      createdAt: generateDateTime(i * 5),
    });
  }

  return reports;
};

const generateAuditLogs = (
  count: number,
  admins: Admin[],
  teachers: Teacher[],
): AuditLog[] => {
  const logs: AuditLog[] = [];
  const actions = [
    "CREATE",
    "UPDATE",
    "DELETE",
    "VIEW",
    "LOGIN",
    "LOGOUT",
    "EXPORT",
    "IMPORT",
  ];
  const entityTypes = [
    "Student",
    "Teacher",
    "Class",
    "Subject",
    "Grade",
    "Attendance",
    "User",
    "Setting",
  ];
  const severities: Array<"info" | "warning" | "critical"> = [
    "info",
    "info",
    "info",
    "warning",
    "critical",
  ];

  for (let i = 0; i < count; i++) {
    const user =
      i % 3 === 0 ? admins[i % admins.length] : teachers[i % teachers.length];
    const action = actions[i % actions.length];
    const entityType = entityTypes[i % entityTypes.length];
    const severity = getRandomElement(severities);

    logs.push({
      id: generateId("adt", i + 1),
      userId: user.id,
      userRole: i % 3 === 0 ? "admin" : "teacher",
      action,
      entityType,
      entityId: generateId("ent", i + 1),
      oldValue: action === "UPDATE" ? { status: "old" } : undefined,
      newValue:
        action === "UPDATE" || action === "CREATE"
          ? { status: "new" }
          : undefined,
      timestamp: generateDateTime(i),
      ipAddress: `192.168.1.${100 + (i % 100)}`,
    });
  }

  return logs;
};


const generateIntegrations = (): Integration[] => {
  return [
    {
      id: "int001",
      name: "Google Workspace",
      category: "Productivity",
      status: "connected",
      lastSync: generateDateTime(0, 6),
      description: "SSO, Google Classroom sync, Drive storage",
    },
    {
      id: "int002",
      name: "Microsoft 365",
      category: "Productivity",
      status: "disconnected",
      lastSync: "—",
      description: "Teams integration, OneDrive, Outlook sync",
    },
    {
      id: "int003",
      name: "Zoom",
      category: "Communication",
      status: "connected",
      lastSync: generateDateTime(0, 8),
      description: "Virtual classrooms and meeting scheduling",
    },
    {
      id: "int004",
      name: "Twilio / SMS Gateway",
      category: "Notifications",
      status: "connected",
      lastSync: generateDateTime(0, 1),
      description: "SMS alerts for attendance, announcements",
    },
    {
      id: "int005",
      name: "Razorpay",
      category: "Payments",
      status: "connected",
      lastSync: generateDateTime(1, 0),
      description: "Fee collection and payment processing",
    },
    {
      id: "int006",
      name: "AWS S3",
      category: "Storage",
      status: "connected",
      lastSync: generateDateTime(0, 2),
      description: "File storage for assignments and documents",
    },
    {
      id: "int007",
      name: "SendGrid",
      category: "Email",
      status: "error",
      lastSync: generateDateTime(1, 10),
      description: "Transactional email delivery service",
    },
  ];
};

// ==================== SYSTEM METRICS ====================

const SYSTEM_METRICS = {
  totalUsers: 227, // 5 admins + 20 teachers + 150 students + 50 parents + 2 librarians
  activeUsers: 198,
  storageUsed: "42.8 GB",
  storageTotal: "100 GB",
  uptime: "99.97%",
  apiCallsToday: 28453,
  avgResponseTime: "142ms",
  activeSessionsNow: 186,
  pendingInvites: 14,
  failedLogins24h: 7,
};

// ==================== GENERATE ALL DATA ====================

console.log("[INIT] Starting SETU Mock Data Generation...\n");

// Generate base entities
console.log("[GENERATE] Creating base entities...");
const admins = generateAdmins(COUNTS.admins);
console.log(`  ✓ Generated ${admins.length} admins`);

const teachers = generateTeachers(COUNTS.teachers);
console.log(`  ✓ Generated ${teachers.length} teachers`);

const students = generateStudents(COUNTS.students);
console.log(`  ✓ Generated ${students.length} students`);

const parents = generateParents(COUNTS.parents);
console.log(`  ✓ Generated ${parents.length} parents`);

const librarians = generateLibrarians(COUNTS.librarians);
console.log(`  ✓ Generated ${librarians.length} librarians`);

const subjects = generateSubjects(COUNTS.subjects);
console.log(`  ✓ Generated ${subjects.length} subjects`);

const classes = generateClasses(COUNTS.classes);
console.log(`  ✓ Generated ${classes.length} classes`);

// Generate system users
export const systemUsers: SystemUser[] = [
  // ── Existing entity-derived users (roleCategory added) ──────────────────
  ...admins.map((a) => ({
    id: a.userId,
    name: a.name,
    email: a.email,
    role: "master_admin" as const,
    roleCategory: "administrative" as const,
    status: "active" as const,
    lastLogin: a.lastLogin,
    createdAt: a.createdAt,
    twoFactorEnabled: true,
  })),
  ...teachers.map((t) => ({
    id: t.userId,
    name: t.name,
    email: t.email,
    role: "teacher" as const,
    roleCategory: "teaching_support" as const,
    department: t.department,
    status: "active" as const,
    lastLogin: generateDateTime(1, t.id.charCodeAt(3) % 24),
    createdAt: t.joinDate,
    twoFactorEnabled: false,
  })),
  ...students.map((s) => ({
    id: s.userId,
    name: s.name,
    email: s.email,
    role: "student" as const,
    roleCategory: "student" as const,
    status: "active" as const,
    lastLogin: generateDateTime(0, s.id.charCodeAt(3) % 12),
    createdAt: s.admissionDate,
    twoFactorEnabled: false,
  })),
  ...parents.map((p) => ({
    id: p.userId,
    name: p.name,
    email: p.email,
    role: "parent" as const,
    roleCategory: "parent" as const,
    status: "active" as const,
    lastLogin: generateDateTime(2, p.id.charCodeAt(3) % 24),
    createdAt: generateDate(100),
    twoFactorEnabled: false,
  })),
  ...librarians.map((l) => ({
    id: l.userId,
    name: l.name,
    email: l.email,
    role: "librarian" as const,
    roleCategory: "technical_specialist" as const,
    department: l.department,
    status: "active" as const,
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(150),
    twoFactorEnabled: false,
  })),

  // ── IT Administration ────────────────────────────────────────────────────
  {
    id: "usr-new-001",
    name: "James Carter",
    email: "it.admin@setu.edu",
    role: "it_admin",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(400),
    twoFactorEnabled: true,
    department: "IT",
  },
  {
    id: "usr-new-002",
    name: "Olivia Patel",
    email: "it.admin2@setu.edu",
    role: "it_admin",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(1, 11),
    createdAt: generateDate(300),
    twoFactorEnabled: true,
    department: "IT",
  },
  {
    id: "usr-new-003",
    name: "Daniel Hughes",
    email: "it.tech@setu.edu",
    role: "it_technician",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(250),
    twoFactorEnabled: false,
    department: "IT",
  },
  {
    id: "usr-new-004",
    name: "Fatima Malik",
    email: "it.tech2@setu.edu",
    role: "it_technician",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(1, 10),
    createdAt: generateDate(180),
    twoFactorEnabled: false,
    department: "IT",
  },

  // ── School Leadership ────────────────────────────────────────────────────
  {
    id: "usr-new-005",
    name: "Dr. Margaret Collins",
    email: "principal@setu.edu",
    role: "principal",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 7),
    createdAt: generateDate(800),
    twoFactorEnabled: true,
  },
  {
    id: "usr-new-006",
    name: "Mr. Rajesh Kumar",
    email: "principal2@setu.edu",
    role: "principal",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(1, 8),
    createdAt: generateDate(600),
    twoFactorEnabled: true,
  },

  // ── Finance ──────────────────────────────────────────────────────────────
  {
    id: "usr-new-007",
    name: "Susan Blackwood",
    email: "finance@setu.edu",
    role: "finance_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(350),
    twoFactorEnabled: true,
    department: "Finance",
  },
  {
    id: "usr-new-008",
    name: "Tom Nguyen",
    email: "finance2@setu.edu",
    role: "finance_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(2, 11),
    createdAt: generateDate(200),
    twoFactorEnabled: true,
    department: "Finance",
  },

  // ── HR ───────────────────────────────────────────────────────────────────
  {
    id: "usr-new-009",
    name: "Claire Foster",
    email: "hr@setu.edu",
    role: "hr_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 10),
    createdAt: generateDate(420),
    twoFactorEnabled: true,
    department: "HR",
  },
  {
    id: "usr-new-010",
    name: "Anthony Walsh",
    email: "hr2@setu.edu",
    role: "hr_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(280),
    twoFactorEnabled: false,
    department: "HR",
  },

  // ── Admissions ───────────────────────────────────────────────────────────
  {
    id: "usr-new-011",
    name: "Natasha Rivers",
    email: "admissions@setu.edu",
    role: "admissions_officer",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(300),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-012",
    name: "Kevin O'Brien",
    email: "admissions2@setu.edu",
    role: "admissions_officer",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(1, 11),
    createdAt: generateDate(150),
    twoFactorEnabled: false,
  },

  // ── Data / MIS ───────────────────────────────────────────────────────────
  {
    id: "usr-new-013",
    name: "Laura Simmons",
    email: "data@setu.edu",
    role: "data_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(380),
    twoFactorEnabled: true,
    department: "MIS",
  },
  {
    id: "usr-new-014",
    name: "Marcus Bell",
    email: "data2@setu.edu",
    role: "data_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(2, 10),
    createdAt: generateDate(220),
    twoFactorEnabled: true,
    department: "MIS",
  },

  // ── Facilities ───────────────────────────────────────────────────────────
  {
    id: "usr-new-015",
    name: "Peter Lawson",
    email: "facilities@setu.edu",
    role: "facilities_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(0, 7),
    createdAt: generateDate(500),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-016",
    name: "Sandra Kim",
    email: "facilities2@setu.edu",
    role: "facilities_manager",
    roleCategory: "administrative",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(310),
    twoFactorEnabled: false,
  },

  // ── SLT Members ──────────────────────────────────────────────────────────
  {
    id: "usr-new-017",
    name: "Dr. Frances Owens",
    email: "slt@setu.edu",
    role: "slt_member",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(600),
    twoFactorEnabled: true,
    sltPermissions: { isSLT: true, sltAccessLevel: "full" },
  },
  {
    id: "usr-new-018",
    name: "Mr. Graham Stewart",
    email: "slt2@setu.edu",
    role: "slt_member",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(1, 10),
    createdAt: generateDate(450),
    twoFactorEnabled: true,
    sltPermissions: { isSLT: true, sltAccessLevel: "strategic" },
  },

  // ── Head of Department ───────────────────────────────────────────────────
  {
    id: "usr-new-019",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@setu.edu",
    role: "head_of_department",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(550),
    twoFactorEnabled: false,
    assignedDepartment: "Mathematics",
    sltPermissions: { isSLT: true, sltAccessLevel: "strategic" },
  },
  {
    id: "usr-new-020",
    name: "Mr. David Clarke",
    email: "hod.science@setu.edu",
    role: "head_of_department",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(1, 11),
    createdAt: generateDate(400),
    twoFactorEnabled: false,
    assignedDepartment: "Science",
  },

  // ── Head of Year ─────────────────────────────────────────────────────────
  {
    id: "usr-new-021",
    name: "Ms. Rachel Thompson",
    email: "hoy@setu.edu",
    role: "head_of_year",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(480),
    twoFactorEnabled: false,
    assignedYearGroup: "Year 10",
    sltPermissions: { isSLT: true, sltAccessLevel: "operational" },
  },
  {
    id: "usr-new-022",
    name: "Mr. Carl Hutchinson",
    email: "hoy2@setu.edu",
    role: "head_of_year",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(1, 8),
    createdAt: generateDate(320),
    twoFactorEnabled: false,
    assignedYearGroup: "Year 11",
  },

  // ── Examinations Officer ─────────────────────────────────────────────────
  {
    id: "usr-new-023",
    name: "Ms. Helen Park",
    email: "exams@setu.edu",
    role: "examinations_officer",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(360),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-024",
    name: "Mr. Simon Bradshaw",
    email: "exams2@setu.edu",
    role: "examinations_officer",
    roleCategory: "academic_leadership",
    status: "active",
    lastLogin: generateDateTime(2, 10),
    createdAt: generateDate(210),
    twoFactorEnabled: false,
  },

  // ── Safeguarding Lead ────────────────────────────────────────────────────
  {
    id: "usr-new-025",
    name: "Ms. Diana Fletcher",
    email: "dsl@setu.edu",
    role: "safeguarding_lead",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(500),
    twoFactorEnabled: true,
  },
  {
    id: "usr-new-026",
    name: "Mr. Tony Benson",
    email: "dsl2@setu.edu",
    role: "safeguarding_lead",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(350),
    twoFactorEnabled: true,
  },

  // ── SENCO ────────────────────────────────────────────────────────────────
  {
    id: "usr-new-027",
    name: "Mrs. Alison Grant",
    email: "senco@setu.edu",
    role: "senco",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(420),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-028",
    name: "Ms. Joy Mensah",
    email: "senco2@setu.edu",
    role: "senco",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(1, 10),
    createdAt: generateDate(270),
    twoFactorEnabled: false,
  },

  // ── Attendance Officer ───────────────────────────────────────────────────
  {
    id: "usr-new-029",
    name: "Mr. Fred Cooper",
    email: "attendance@setu.edu",
    role: "attendance_officer",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(330),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-030",
    name: "Mrs. Nadia Ibrahim",
    email: "attendance2@setu.edu",
    role: "attendance_officer",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(190),
    twoFactorEnabled: false,
  },

  // ── Careers Advisor ──────────────────────────────────────────────────────
  {
    id: "usr-new-031",
    name: "Ms. Wendy Shaw",
    email: "careers@setu.edu",
    role: "careers_advisor",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(0, 10),
    createdAt: generateDate(380),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-032",
    name: "Mr. Ian Douglas",
    email: "careers2@setu.edu",
    role: "careers_advisor",
    roleCategory: "safeguarding_welfare",
    status: "active",
    lastLogin: generateDateTime(2, 11),
    createdAt: generateDate(240),
    twoFactorEnabled: false,
  },

  // ── Cover Supervisor ─────────────────────────────────────────────────────
  {
    id: "usr-new-033",
    name: "Mr. Barry Stone",
    email: "cover@setu.edu",
    role: "cover_supervisor",
    roleCategory: "teaching_support",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(200),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-034",
    name: "Ms. Gail Summers",
    email: "cover2@setu.edu",
    role: "cover_supervisor",
    roleCategory: "teaching_support",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(150),
    twoFactorEnabled: false,
  },

  // ── Teaching Assistant ───────────────────────────────────────────────────
  {
    id: "usr-new-035",
    name: "Mrs. Amy Webb",
    email: "ta@setu.edu",
    role: "teaching_assistant",
    roleCategory: "teaching_support",
    status: "active",
    lastLogin: generateDateTime(0, 9),
    createdAt: generateDate(280),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-036",
    name: "Mr. Leon Price",
    email: "ta2@setu.edu",
    role: "teaching_assistant",
    roleCategory: "teaching_support",
    status: "active",
    lastLogin: generateDateTime(1, 10),
    createdAt: generateDate(170),
    twoFactorEnabled: false,
  },

  // ── Science Technician ───────────────────────────────────────────────────
  {
    id: "usr-new-037",
    name: "Mr. Owen Hardy",
    email: "sci.tech@setu.edu",
    role: "science_technician",
    roleCategory: "technical_specialist",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(300),
    twoFactorEnabled: false,
    department: "Science",
    assignedSubjects: ["Biology", "Chemistry", "Physics"],
  },
  {
    id: "usr-new-038",
    name: "Ms. Zoe Chambers",
    email: "sci.tech2@setu.edu",
    role: "science_technician",
    roleCategory: "technical_specialist",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(200),
    twoFactorEnabled: false,
    department: "Science",
    assignedSubjects: ["Physics"],
  },

  // ── Subject Technician ───────────────────────────────────────────────────
  {
    id: "usr-new-039",
    name: "Mr. Alan Cross",
    email: "subj.tech@setu.edu",
    role: "subject_technician",
    roleCategory: "technical_specialist",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(250),
    twoFactorEnabled: false,
    assignedSubjects: ["Design Technology", "Art"],
  },
  {
    id: "usr-new-040",
    name: "Ms. Tina Marsh",
    email: "subj.tech2@setu.edu",
    role: "subject_technician",
    roleCategory: "technical_specialist",
    status: "active",
    lastLogin: generateDateTime(1, 10),
    createdAt: generateDate(160),
    twoFactorEnabled: false,
    assignedSubjects: ["Drama", "Music"],
  },

  // ── Student Leadership ───────────────────────────────────────────────────
  {
    id: "usr-new-041",
    name: "Alex Rivera",
    email: "student.leader@setu.edu",
    role: "student_leadership",
    roleCategory: "student",
    status: "active",
    lastLogin: generateDateTime(0, 15),
    createdAt: generateDate(365),
    twoFactorEnabled: false,
    studentLeadershipType: "head_boy",
  },
  {
    id: "usr-new-042",
    name: "Priya Sharma",
    email: "student.leader2@setu.edu",
    role: "student_leadership",
    roleCategory: "student",
    status: "active",
    lastLogin: generateDateTime(0, 16),
    createdAt: generateDate(365),
    twoFactorEnabled: false,
    studentLeadershipType: "head_girl",
  },

  // ── Support Staff ────────────────────────────────────────────────────────
  {
    id: "usr-new-043",
    name: "Mrs. Carol Day",
    email: "reception@setu.edu",
    role: "support_staff",
    roleCategory: "support",
    status: "active",
    lastLogin: generateDateTime(0, 8),
    createdAt: generateDate(600),
    twoFactorEnabled: false,
  },
  {
    id: "usr-new-044",
    name: "Mr. Phil Watts",
    email: "support2@setu.edu",
    role: "support_staff",
    roleCategory: "support",
    status: "active",
    lastLogin: generateDateTime(1, 9),
    createdAt: generateDate(400),
    twoFactorEnabled: false,
  },
];
console.log(`  ✓ Generated ${systemUsers.length} system users`);

// One representative demo user per role (for the role switcher)
export const mockUsers: SystemUser[] = [
  systemUsers.find((u) => u.role === "master_admin")!,
  systemUsers.find((u) => u.role === "it_admin")!,
  systemUsers.find((u) => u.role === "it_technician")!,
  systemUsers.find((u) => u.role === "principal")!,
  systemUsers.find((u) => u.role === "finance_manager")!,
  systemUsers.find((u) => u.role === "hr_manager")!,
  systemUsers.find((u) => u.role === "admissions_officer")!,
  systemUsers.find((u) => u.role === "data_manager")!,
  systemUsers.find((u) => u.role === "facilities_manager")!,
  systemUsers.find((u) => u.role === "slt_member")!,
  systemUsers.find((u) => u.role === "head_of_department")!,
  systemUsers.find((u) => u.role === "head_of_year")!,
  systemUsers.find((u) => u.role === "examinations_officer")!,
  systemUsers.find((u) => u.role === "safeguarding_lead")!,
  systemUsers.find((u) => u.role === "senco")!,
  systemUsers.find((u) => u.role === "attendance_officer")!,
  systemUsers.find((u) => u.role === "careers_advisor")!,
  systemUsers.find((u) => u.role === "teacher")!,
  systemUsers.find((u) => u.role === "cover_supervisor")!,
  systemUsers.find((u) => u.role === "teaching_assistant")!,
  systemUsers.find((u) => u.role === "librarian")!,
  systemUsers.find((u) => u.role === "science_technician")!,
  systemUsers.find((u) => u.role === "subject_technician")!,
  systemUsers.find((u) => u.role === "student")!,
  systemUsers.find((u) => u.role === "student_leadership")!,
  systemUsers.find((u) => u.role === "parent")!,
  systemUsers.find((u) => u.role === "support_staff")!,
].filter(Boolean);

// Generate role permissions for the roles-permissions page
export const rolePermissions: RolePermission[] = [];

// Establish relational integrity
console.log("\n[LINK] Establishing relational integrity...");

// 1. Link students to parents (1-2 children per parent)
let studentIndex = 0;
for (let i = 0; i < parents.length; i++) {
  const numChildren = Math.floor(Math.random() * 2) + 1; // 1-2 children
  for (let j = 0; j < numChildren && studentIndex < students.length; j++) {
    const student = students[studentIndex];
    student.parentId = parents[i].id;
    if (!parents[i].children.includes(student.id)) {
      parents[i].children.push(student.id);
    }
    studentIndex++;
  }
}
console.log(`  ✓ Linked ${studentIndex} students to parents`);

// 2. Assign students to classes (20-35 students per class)
let studentCounter = 0;
for (const cls of classes) {
  const numStudents = Math.floor(Math.random() * 16) + 20; // 20-35 students
  for (let i = 0; i < numStudents && studentCounter < students.length; i++) {
    const student = students[studentCounter];
    student.classId = cls.id;
    cls.students.push(student.id);
    studentCounter++;
  }
}
console.log(
  `  ✓ Assigned ${studentCounter} students to ${classes.length} classes`,
);

// 3. Assign teachers to classes and subjects
for (let i = 0; i < teachers.length; i++) {
  const teacher = teachers[i];

  // Assign 1-3 subjects
  const numSubjects = Math.floor(Math.random() * 3) + 1;
  const teacherSubjects = getRandomElements(subjects, numSubjects);
  teacher.subjects = teacherSubjects.map((s) => s.id);

  // Assign 1-4 classes
  const numClasses = Math.floor(Math.random() * 4) + 1;
  const teacherClasses = getRandomElements(classes, numClasses);
  teacher.classes = teacherClasses.map((c) => c.id);

  // Add teacher to subjects
  for (const subject of teacherSubjects) {
    if (!subject.teachers.includes(teacher.id)) {
      subject.teachers.push(teacher.id);
    }
  }

  // Assign as class teacher for one class
  if (teacherClasses.length > 0 && !teacherClasses[0].classTeacherId) {
    teacher.isClassTeacher = teacherClasses[0].id;
    teacherClasses[0].classTeacherId = teacher.id;
  }
}
console.log(`  ✓ Assigned subjects and classes to ${teachers.length} teachers`);

// 4. Assign subject heads (3 teachers)
const headTeacherIndices = getRandomElements(
  [...Array(teachers.length).keys()],
  3,
);
for (let i = 0; i < 3; i++) {
  const teacherIndex = headTeacherIndices[i];
  const subjectIndex = i * 6; // Distribute across subjects

  if (teachers[teacherIndex] && subjects[subjectIndex]) {
    teachers[teacherIndex].isHeadOfSubject = subjects[subjectIndex].id;
    subjects[subjectIndex].headTeacherId = teachers[teacherIndex].id;
  }
}
console.log(`  ✓ Assigned 3 teachers as heads of subjects`);

// 5. Assign subjects to classes
for (const cls of classes) {
  const numSubjects = Math.floor(Math.random() * 4) + 6; // 6-9 subjects per class
  const classSubjects = getRandomElements(subjects, numSubjects);
  cls.subjects = classSubjects.map((s) => s.id);

  // Add class to subjects
  for (const subject of classSubjects) {
    if (!subject.classes.includes(cls.id)) {
      subject.classes.push(cls.id);
    }
  }
}
console.log(`  ✓ Assigned subjects to ${classes.length} classes`);

// Generate dependent entities
console.log("\n[GENERATE] Creating dependent entities...");

export const timetable = generateTimetable(
  COUNTS.timetableEntries,
  classes,
  subjects,
  teachers,
);
console.log(`  ✓ Generated ${timetable.length} timetable entries`);

const schedulePeriods = generateSchedulePeriods();
console.log(`  ✓ Generated ${schedulePeriods.length} schedule periods`);

export const attendance = generateAttendance(
  COUNTS.attendanceRecords,
  students,
  classes,
  teachers,
);
console.log(`  ✓ Generated ${attendance.length} attendance records`);

// Alias for backward compatibility
export { attendance as attendanceRecords };

export const assignments = generateAssignments(
  COUNTS.assignments,
  subjects,
  classes,
  teachers,
);
console.log(`  ✓ Generated ${assignments.length} assignments`);

const submissions = generateSubmissions(assignments, students);
console.log(`  ✓ Generated ${submissions.length} assignment submissions`);

export const grades = generateGrades(
  COUNTS.gradeEntries,
  students,
  subjects,
  classes,
  teachers,
);
console.log(`  ✓ Generated ${grades.length} grade entries`);

const announcements = generateAnnouncements(
  COUNTS.announcements,
  admins,
  teachers,
);
console.log(`  ✓ Generated ${announcements.length} announcements`);

const messages = generateMessages(
  COUNTS.messages,
  students,
  teachers,
  parents,
  classes,
);
console.log(`  ✓ Generated ${messages.length} messages`);

const books = generateBooks(COUNTS.books);
console.log(`  ✓ Generated ${books.length} books`);

const libraryTransactions = generateLibraryTransactions(
  COUNTS.libraryTransactions,
  books,
  students,
);
console.log(
  `  ✓ Generated ${libraryTransactions.length} library transactions (0 for parents)`,
);

const tickets = generateTickets(
  COUNTS.tickets,
  admins,
  teachers,
  students,
  parents,
);
console.log(`  ✓ Generated ${tickets.length} tickets (0 from parents)`);

const reports = generateReports(COUNTS.reports, admins, teachers);
console.log(`  ✓ Generated ${reports.length} reports`);

export const auditLogs = generateAuditLogs(COUNTS.auditLogs, admins, teachers);
console.log(`  ✓ Generated ${auditLogs.length} audit logs`);

const integrations = generateIntegrations();
console.log(`  ✓ Generated ${integrations.length} integrations`);

// Create the complete data store
export const mockData: MockDataStore = {
  systemUsers,
  admins,
  teachers,
  students,
  parents,
  librarians,
  subjectCategories,
  subjects,
  classes,
  timetable,
  schedulePeriods,
  attendance,
  assignments,
  submissions,
  grades,
  announcements,
  messages,
  books,
  libraryTransactions,
  tickets,
  reports,
  auditLogs,
  permissions: DEFAULT_PERMISSIONS,
  rolePermissions: [],
  accessConfigs: [],
  integrations,
};

// Update assignments with submissions
for (const assignment of mockData.assignments) {
  assignment.submissions = mockData.submissions.filter(
    (s) => s.assignmentId === assignment.id,
  );
}

console.log("\n[SUCCESS] Mock data generation complete!\n");

// ==================== CONSOLE DEMONSTRATIONS ====================

console.log("========== DATA RELATIONSHIP DEMONSTRATIONS ==========\n");

// Demo 1: Student-Parent Relationship
console.log("[DEMO 1] Student-Parent Relationships:");
const sampleStudent = mockData.students[0];
const sampleParent = mockData.parents.find(
  (p) => p.id === sampleStudent.parentId,
);
console.log(`  Student: ${sampleStudent.name} (ID: ${sampleStudent.id})`);
console.log(`  → Parent: ${sampleParent?.name} (ID: ${sampleParent?.id})`);
console.log(`  → Relationship: ${sampleParent?.relationship}`);
console.log(`  → Parent's children: ${sampleParent?.children.length}`);
console.log();

// Demo 2: Teacher-Subject-Student Chain
console.log("[DEMO 2] Teacher-Subject-Student Chain:");
const sampleTeacher =
  mockData.teachers.find((t) => t.isHeadOfSubject) || mockData.teachers[0];
const sampleSubject = mockData.subjects.find(
  (s) => s.id === sampleTeacher.subjects[0],
);
const sampleClass = mockData.classes.find(
  (c) => c.id === sampleTeacher.classes[0],
);
console.log(
  `  Teacher: ${sampleTeacher.name} (Head of Subject: ${sampleTeacher.isHeadOfSubject ? "Yes" : "No"})`,
);
console.log(`  → Teaches: ${sampleSubject?.name}`);
console.log(`  → Class: ${sampleClass?.name}`);
console.log(`  → Students in class: ${sampleClass?.students.length}`);
console.log();

// Demo 3: Class Composition
console.log("[DEMO 3] Class Composition:");
const demoClass = mockData.classes[0];
const classTeacher = mockData.teachers.find(
  (t) => t.id === demoClass.classTeacherId,
);
const classStudents = mockData.students.filter(
  (s) => s.classId === demoClass.id,
);
console.log(`  Class: ${demoClass.name}`);
console.log(`  → Class Teacher: ${classTeacher?.name}`);
console.log(`  → Subjects: ${demoClass.subjects.length}`);
console.log(`  → Students: ${classStudents.length}`);
console.log(`  → Capacity: ${demoClass.capacity}`);
console.log();

// Demo 4: Library Transactions (Only Students)
console.log("[DEMO 4] Library Transactions (Parents Blocked):");
const studentTransactions = mockData.libraryTransactions.filter((t) => {
  const student = mockData.students.find((s) => s.id === t.studentId);
  return student !== undefined;
}).length;
const parentTransactions = mockData.libraryTransactions.filter((t) => {
  const parent = mockData.parents.find((p) => p.children.includes(t.studentId));
  return parent !== undefined && t.studentId.startsWith("par");
}).length;
console.log(`  Total Transactions: ${mockData.libraryTransactions.length}`);
console.log(`  Student Transactions: ${studentTransactions}`);
console.log(
  `  Parent Transactions: ${parentTransactions} (BLOCKED by default)`,
);
console.log(`  Parents can borrow: ${mockData.parents[0].isAllowedToBorrow}`);
console.log();

// Demo 5: Ticket Creation (Parents Blocked)
console.log("[DEMO 5] Ticket Creation Restrictions:");
const ticketsByRole = {
  admin: mockData.tickets.filter((t) => t.createdByRole === "admin").length,
  teacher: mockData.tickets.filter((t) => t.createdByRole === "teacher").length,
  student: mockData.tickets.filter((t) => t.createdByRole === "student").length,
  parent: mockData.tickets.filter((t) => t.createdByRole === "parent").length,
};
console.log(`  Tickets by Admin: ${ticketsByRole.admin}`);
console.log(`  Tickets by Teacher: ${ticketsByRole.teacher}`);
console.log(`  Tickets by Student: ${ticketsByRole.student}`);
console.log(`  Tickets by Parent: ${ticketsByRole.parent} (BLOCKED)`);
console.log(
  `  Parents can submit tickets: ${mockData.parents[0].canSubmitTickets}`,
);
console.log();

// Demo 6: Message Validation
console.log("[DEMO 6] Message Validation (Allocated Teachers Only):");
const validMessages = mockData.messages.filter((m) => m.isValid).length;
const invalidMessages = mockData.messages.filter((m) => !m.isValid).length;
console.log(`  Total Messages: ${mockData.messages.length}`);
console.log(`  Valid Messages: ${validMessages}`);
console.log(`  Invalid Messages: ${invalidMessages}`);
console.log(
  `  Example Validation: ${mockData.messages.find((m) => !m.isValid)?.validationNote || "All messages valid"}`,
);
console.log();

// Demo 7: Data Integrity Check
console.log("[DEMO 7] Data Integrity Summary:");
console.log(`  Total Users: ${mockData.systemUsers.length}`);
console.log(
  `  Students with Parents: ${mockData.students.filter((s) => s.parentId).length}/${mockData.students.length}`,
);
console.log(
  `  Teachers with Classes: ${mockData.teachers.filter((t) => t.classes.length > 0).length}/${mockData.teachers.length}`,
);
console.log(
  `  Classes with Teachers: ${mockData.classes.filter((c) => c.classTeacherId).length}/${mockData.classes.length}`,
);
console.log(
  `  Subjects with Heads: ${mockData.subjects.filter((s) => s.headTeacherId).length}/3 (target: 3)`,
);
console.log();

// Demo 8: Sample Queries
console.log("[DEMO 8] Sample Data Queries:");
const grade10A = mockData.classes.find((c) => c.name === "Grade 10-A");
if (grade10A) {
  const grade10AStudents = mockData.students.filter(
    (s) => s.classId === grade10A.id,
  );
  const grade10ASubjects = mockData.subjects.filter((s) =>
    s.classes.includes(grade10A.id),
  );
  const grade10ATeacher = mockData.teachers.find(
    (t) => t.id === grade10A.classTeacherId,
  );
  console.log(`  Query: Grade 10-A Details`);
  console.log(`    → Students: ${grade10AStudents.length}`);
  console.log(`    → Subjects: ${grade10ASubjects.length}`);
  console.log(`    → Class Teacher: ${grade10ATeacher?.name}`);
}
console.log();

console.log("========== END DEMONSTRATIONS ==========\n");

// ==================== NOTIFICATIONS ====================
// Simple notifications for UI display (used by app-shell)
export const notifications = [
  {
    id: "notif-001",
    title: "New Assignment",
    message: "Mathematics homework has been assigned",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-002",
    title: "Grade Published",
    message: "Your Science quiz grades are now available",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "notif-003",
    title: "Attendance Marked",
    message: "You were marked present in all classes today",
    time: "1 day ago",
    read: true,
  },
  {
    id: "notif-004",
    title: "New Announcement",
    message: "School will be closed next Friday for maintenance",
    time: "2 days ago",
    read: true,
  },
];

// ==================== DASHBOARD DATA ====================
// Dashboard-specific data structures
export const attendanceChartData = [
  { day: "Mon", present: 95, absent: 5 },
  { day: "Tue", present: 92, absent: 8 },
  { day: "Wed", present: 98, absent: 2 },
  { day: "Thu", present: 94, absent: 6 },
  { day: "Fri", present: 90, absent: 10 },
];

export const gradeDistribution = [
  { grade: "A", count: 45 },
  { grade: "B", count: 62 },
  { grade: "C", count: 38 },
  { grade: "D", count: 15 },
  { grade: "F", count: 5 },
];

export const userActivityChart = [
  { hour: "00:00", users: 12 },
  { hour: "04:00", users: 5 },
  { hour: "08:00", users: 85 },
  { hour: "12:00", users: 120 },
  { hour: "16:00", users: 95 },
  { hour: "20:00", users: 45 },
];

export const usersByRoleChart = [
  { name: "Students", value: 150, color: "#4f46e5" },
  { name: "Teachers", value: 20, color: "#10b981" },
  { name: "Parents", value: 50, color: "#f59e0b" },
  { name: "Staff", value: 10, color: "#06b6d4" },
];

export const storageBreakdown = [
  { name: "Documents", value: 45 },
  { name: "Media", value: 30 },
  { name: "Backups", value: 15 },
  { name: "Other", value: 10 },
];

export const dashboardSystemUsers = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@school.edu",
    role: "admin",
    lastActive: "2 mins ago",
    status: "active",
  },
  {
    id: "user-002",
    name: "Sarah Johnson",
    email: "sarah.j@school.edu",
    role: "teacher",
    lastActive: "15 mins ago",
    status: "active",
  },
  {
    id: "user-003",
    name: "Michael Chen",
    email: "m.chen@school.edu",
    role: "teacher",
    lastActive: "1 hour ago",
    status: "away",
  },
  {
    id: "user-004",
    name: "Emma Wilson",
    email: "emma.w@student.edu",
    role: "student",
    lastActive: "5 mins ago",
    status: "active",
  },
];

export const subscription = {
  plan: "Enterprise",
  status: "active",
  renewalDate: "2025-12-31",
  features: [
    "Unlimited Users",
    "Advanced Analytics",
    "Priority Support",
    "Custom Branding",
  ],
};

export const recentBackups = [
  {
    id: "bak-001",
    date: "2025-02-25 03:00 AM",
    size: "2.4 GB",
    status: "completed",
    type: "Automatic",
  },
  {
    id: "bak-002",
    date: "2025-02-24 03:00 AM",
    size: "2.3 GB",
    status: "completed",
    type: "Automatic",
  },
  {
    id: "bak-003",
    date: "2025-02-23 03:00 AM",
    size: "2.3 GB",
    status: "completed",
    type: "Automatic",
  },
  {
    id: "bak-004",
    date: "2025-02-22 12:00 PM",
    size: "2.3 GB",
    status: "completed",
    type: "Manual",
  },
];

export const serviceStatuses = [
  { name: "Authentication Service", status: "operational", uptime: "99.99%" },
  { name: "Database", status: "operational", uptime: "99.95%" },
  { name: "Storage", status: "operational", uptime: "99.90%" },
  { name: "Email Service", status: "degraded", uptime: "98.50%" },
];

export const resourceQuotas = {
  storage: { used: 750, total: 1000, unit: "GB" },
  users: { used: 230, total: 500, unit: "users" },
  apiCalls: { used: 45000, total: 100000, unit: "calls/day" },
};

export const equipmentBookings = [
  {
    id: "book-001",
    equipment: "Projector A",
    bookedBy: "Sarah Johnson",
    date: "2025-02-28",
    time: "09:00 - 10:30",
    status: "confirmed",
  },
  {
    id: "book-002",
    equipment: "Laptop Cart",
    bookedBy: "Michael Chen",
    date: "2025-02-28",
    time: "11:00 - 12:00",
    status: "pending",
  },
  {
    id: "book-003",
    equipment: "Science Lab",
    bookedBy: "Emily Davis",
    date: "2025-03-01",
    time: "13:00 - 15:00",
    status: "confirmed",
  },
];

export const rooms = [
  {
    id: "room-001",
    name: "Room 101",
    building: "Main Building",
    type: "classroom" as const,
    capacity: 30,
    status: "available" as const,
  },
  {
    id: "room-002",
    name: "Room 102",
    building: "Main Building",
    type: "classroom" as const,
    capacity: 30,
    status: "occupied" as const,
  },
  {
    id: "room-003",
    name: "Science Lab A",
    building: "Science Wing",
    type: "lab" as const,
    capacity: 24,
    status: "available" as const,
  },
  {
    id: "room-004",
    name: "Auditorium",
    building: "Main Building",
    type: "auditorium" as const,
    capacity: 200,
    status: "available" as const,
  },
  {
    id: "room-005",
    name: "Conference Room",
    building: "Admin Building",
    type: "conference" as const,
    capacity: 12,
    status: "maintenance" as const,
  },
  {
    id: "room-006",
    name: "Staff Room 1",
    building: "Main Building",
    type: "staff-room" as const,
    capacity: 8,
    status: "available" as const,
  },
  {
    id: "room-007",
    name: "Computer Lab",
    building: "Tech Wing",
    type: "lab" as const,
    capacity: 30,
    status: "occupied" as const,
  },
  {
    id: "room-008",
    name: "Room 103",
    building: "Main Building",
    type: "classroom" as const,
    capacity: 28,
    status: "available" as const,
  },
];

export const equipment = [
  {
    id: "eq-001",
    name: "Projector A",
    category: "AV Equipment",
    serialNumber: "SN123456",
    available: true,
    condition: "excellent" as const,
  },
  {
    id: "eq-002",
    name: "Laptop Cart",
    category: "Computing",
    serialNumber: "SN789012",
    available: false,
    condition: "good" as const,
  },
  {
    id: "eq-003",
    name: "Interactive Whiteboard",
    category: "AV Equipment",
    serialNumber: "SN345678",
    available: true,
    condition: "excellent" as const,
  },
  {
    id: "eq-004",
    name: "Tablet Set",
    category: "Computing",
    serialNumber: "SN901234",
    available: true,
    condition: "fair" as const,
  },
  {
    id: "eq-005",
    name: "Microphone System",
    category: "Audio",
    serialNumber: "SN567890",
    available: true,
    condition: "good" as const,
  },
  {
    id: "eq-006",
    name: "Document Camera",
    category: "AV Equipment",
    serialNumber: "SN112233",
    available: false,
    condition: "needs-repair" as const,
  },
];

// Export individual entities for convenience (excluding already-exported items)
export {
  admins,
  teachers,
  students,
  parents,
  librarians,
  subjects,
  classes,
  schedulePeriods,
  submissions,
  announcements,
  messages,
  books,
  libraryTransactions,
  tickets,
  reports,
  DEFAULT_PERMISSIONS as permissions,
  integrations,
  SYSTEM_METRICS as systemMetrics,
};

// Export utility functions
export {
  generateId,
  generateDate,
  generateDateTime,
  getRandomElement,
  getRandomElements,
  shuffleArray,
};

// Default export
export default mockData;
