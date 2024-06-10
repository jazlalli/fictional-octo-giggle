type Entity<T extends object> = T & { _id: string };

type Gender = "Male" | "Female";

type User = Entity<{
  firstname: string;
  lastname: string;
  age: number;
  gender: Gender;
}>;
