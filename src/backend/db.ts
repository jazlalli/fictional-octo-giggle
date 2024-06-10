const defaultUsers: User[] = [
  {
    _id: "8fb8e010-4572-446d-b778-9a6e06fe8a44",
    firstname: "Johnny",
    lastname: "Maverick",
    age: 45,
    gender: "Male",
  },
  {
    _id: "72398210-5dbb-4566-ada9-e992d8df1b09",
    firstname: "Martha",
    lastname: "Peach",
    age: 32,
    gender: "Female",
  },
  {
    _id: "63396210-5dbb-4236-adc9-d094d7ad3c90",
    firstname: "Caryl",
    lastname: "Baker",
    age: 38,
    gender: "Female",
  },
];

// mock storage
export const UserTable = new Map<User["_id"], User>(
  defaultUsers.map((user) => [user._id, user]),
);
