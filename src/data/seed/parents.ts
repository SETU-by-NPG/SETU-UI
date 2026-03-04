export interface Guardian {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
    country: string;
  };
  occupation: string;
  relationship:
    | "MOTHER"
    | "FATHER"
    | "GUARDIAN"
    | "GRANDPARENT"
    | "STEP_PARENT"
    | "SIBLING"
    | "OTHER";
}

export interface StudentGuardian {
  studentId: string;
  guardianId: string;
  relationship:
    | "MOTHER"
    | "FATHER"
    | "GUARDIAN"
    | "GRANDPARENT"
    | "STEP_PARENT"
    | "SIBLING"
    | "OTHER";
  isPrimary: boolean;
  hasParentalResponsibility: boolean;
}

export const guardians: Guardian[] = [
  {
    id: "grd_001",
    orgId: "org_001",
    userId: "usr_101",
    title: "Mr",
    firstName: "Michael",
    lastName: "Harris",
    email: "m.harris@email.com",
    phone: "07700 900001",
    address: {
      line1: "12 Oak Avenue",
      line2: "",
      city: "London",
      postcode: "SE1 2AB",
      country: "UK",
    },
    occupation: "Electrician",
    relationship: "FATHER",
  },
  {
    id: "grd_002",
    orgId: "org_001",
    userId: "usr_102",
    title: "Mrs",
    firstName: "Priya",
    lastName: "Begum",
    email: "p.begum@email.com",
    phone: "07700 900002",
    address: {
      line1: "45 Elm Street",
      line2: "",
      city: "London",
      postcode: "E1 5CD",
      country: "UK",
    },
    occupation: "Nurse",
    relationship: "MOTHER",
  },
  {
    id: "grd_003",
    orgId: "org_001",
    userId: "usr_103",
    title: "Mr",
    firstName: "David",
    lastName: "Johnson",
    email: "d.johnson@email.com",
    phone: "07700 900003",
    address: {
      line1: "8 Maple Road",
      line2: "",
      city: "London",
      postcode: "SE4 3EF",
      country: "UK",
    },
    occupation: "Accountant",
    relationship: "GUARDIAN",
  },
  {
    id: "grd_004",
    orgId: "org_001",
    userId: "usr_104",
    title: "Mrs",
    firstName: "Emma",
    lastName: "Williams",
    email: "e.williams@email.com",
    phone: "07700 900004",
    address: {
      line1: "3 Pine Close",
      line2: "",
      city: "London",
      postcode: "SE5 4GH",
      country: "UK",
    },
    occupation: "Teacher",
    relationship: "MOTHER",
  },
  {
    id: "grd_005",
    orgId: "org_001",
    userId: "usr_105",
    title: "Mr",
    firstName: "Ahmed",
    lastName: "Abdullah",
    email: "a.abdullah@email.com",
    phone: "07700 900005",
    address: {
      line1: "21 Birch Lane",
      line2: "",
      city: "London",
      postcode: "SW2 5IJ",
      country: "UK",
    },
    occupation: "Taxi Driver",
    relationship: "FATHER",
  },
  {
    id: "grd_006",
    orgId: "org_001",
    userId: "usr_106",
    title: "Ms",
    firstName: "Anna",
    lastName: "Kowalska",
    email: "a.kowalska@email.com",
    phone: "07700 900006",
    address: {
      line1: "67 Cedar Way",
      line2: "",
      city: "London",
      postcode: "SE6 6KL",
      country: "UK",
    },
    occupation: "Cleaner",
    relationship: "MOTHER",
  },
  {
    id: "grd_007",
    orgId: "org_001",
    userId: "usr_107",
    title: "Mr",
    firstName: "Robert",
    lastName: "Clarke",
    email: "r.clarke@email.com",
    phone: "07700 900007",
    address: {
      line1: "14 Willow Drive",
      line2: "",
      city: "London",
      postcode: "SE7 7MN",
      country: "UK",
    },
    occupation: "Engineer",
    relationship: "FATHER",
  },
  {
    id: "grd_008",
    orgId: "org_001",
    userId: "usr_108",
    title: "Mrs",
    firstName: "Amrita",
    lastName: "Kaur",
    email: "a.kaur@email.com",
    phone: "07700 900008",
    address: {
      line1: "29 Ash Grove",
      line2: "",
      city: "London",
      postcode: "SE8 8OP",
      country: "UK",
    },
    occupation: "Shop Owner",
    relationship: "MOTHER",
  },
  {
    id: "grd_009",
    orgId: "org_001",
    userId: "usr_109",
    title: "Mr",
    firstName: "Samuel",
    lastName: "Osei",
    email: "s.osei@email.com",
    phone: "07700 900009",
    address: {
      line1: "5 Hawthorn Place",
      line2: "",
      city: "London",
      postcode: "SE9 9QR",
      country: "UK",
    },
    occupation: "IT Manager",
    relationship: "FATHER",
  },
  {
    id: "grd_010",
    orgId: "org_001",
    userId: "usr_110",
    title: "Mrs",
    firstName: "Sophie",
    lastName: "Turner",
    email: "s.turner@email.com",
    phone: "07700 900010",
    address: {
      line1: "88 Beech Road",
      line2: "",
      city: "London",
      postcode: "SE10 0ST",
      country: "UK",
    },
    occupation: "Solicitor",
    relationship: "MOTHER",
  },
];

export const studentGuardians: StudentGuardian[] = [
  {
    studentId: "stu_001",
    guardianId: "grd_001",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_002",
    guardianId: "grd_002",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_003",
    guardianId: "grd_003",
    relationship: "GUARDIAN",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_004",
    guardianId: "grd_004",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_005",
    guardianId: "grd_005",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_006",
    guardianId: "grd_006",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_007",
    guardianId: "grd_007",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_008",
    guardianId: "grd_008",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_009",
    guardianId: "grd_009",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_010",
    guardianId: "grd_010",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_011",
    guardianId: "grd_001",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_012",
    guardianId: "grd_002",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_013",
    guardianId: "grd_003",
    relationship: "GUARDIAN",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_014",
    guardianId: "grd_004",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_015",
    guardianId: "grd_005",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_016",
    guardianId: "grd_006",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_017",
    guardianId: "grd_007",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_018",
    guardianId: "grd_008",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_019",
    guardianId: "grd_009",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_020",
    guardianId: "grd_010",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_021",
    guardianId: "grd_001",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_022",
    guardianId: "grd_002",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_023",
    guardianId: "grd_003",
    relationship: "GUARDIAN",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_024",
    guardianId: "grd_004",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_025",
    guardianId: "grd_005",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_026",
    guardianId: "grd_006",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_027",
    guardianId: "grd_007",
    relationship: "FATHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_028",
    guardianId: "grd_008",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_029",
    guardianId: "grd_009",
    relationship: "GUARDIAN",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
  {
    studentId: "stu_030",
    guardianId: "grd_010",
    relationship: "MOTHER",
    isPrimary: true,
    hasParentalResponsibility: true,
  },
];
