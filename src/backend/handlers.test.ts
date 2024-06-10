import { afterAll, beforeEach, beforeAll, expect, test } from "vitest";
import { setupServer } from "msw/node";
import { setupHandlers } from "./handlers";
import request from "supertest";
import { UserTable } from "./db";

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
];

const server = setupServer(...setupHandlers(UserTable));

// helper for reseeding the DB before or within each test
function reseedData(users: User[]) {
  UserTable.clear();
  users.map((user) => UserTable.set(user._id, user));
  server.resetHandlers(...setupHandlers(UserTable));
}

beforeAll(() => server.listen());

beforeEach(() => {
  reseedData(defaultUsers);
});

afterAll(() => server.close());

test("GET /api/users", async () => {
  const get = await request("localhost").get("/api/users");

  expect(get.status).toBe(200);
  expect(get.body).toBeDefined();
  expect(get.body.data).toBeDefined();

  const { data } = get.body;

  expect(data.length).toBe(2);
  expect(data[0]).toStrictEqual({
    _id: "8fb8e010-4572-446d-b778-9a6e06fe8a44",
    firstname: "Johnny",
    lastname: "Maverick",
    age: 45,
    gender: "Male",
  });
});

test("GET /api/users - no data", async () => {
  reseedData([]);

  const get = await request("localhost").get("/api/users");

  expect(get.status).toBe(200);
  expect(get.body).toBeDefined();
  expect(get.body.data).toBeDefined();
  expect(get.body.data.length).toBe(0);
});

test("GET /api/users/:userId", async () => {
  const get = await request("localhost").get(
    "/api/users/72398210-5dbb-4566-ada9-e992d8df1b09",
  );

  expect(get.status).toBe(200);
  expect(get.body).toStrictEqual({
    _id: "72398210-5dbb-4566-ada9-e992d8df1b09",
    firstname: "Martha",
    lastname: "Peach",
    age: 32,
    gender: "Female",
  });
});

test("GET /api/users/:userId - user not found", async () => {
  const get = await request("localhost").get(
    "/api/users/00000000-1aaa-2222-bbb3-e444d5df6b77",
  );

  expect(get.status).toBe(404);
  expect(get.body).toBeNull();
});

test("PATCH /api/users/:userId", async () => {
  const patch = await request("localhost")
    .patch("/api/users/72398210-5dbb-4566-ada9-e992d8df1b09")
    .send({ age: 34 });

  expect(patch.status).toBe(200);
  expect(patch.body).toStrictEqual({
    _id: "72398210-5dbb-4566-ada9-e992d8df1b09",
    firstname: "Martha",
    lastname: "Peach",
    age: 34,
    gender: "Female",
  });
});

test("PATCH /api/users/:userId - user not found", async () => {
  const patch = await request("localhost")
    .patch("/api/users/00000000-1aaa-2222-bbb3-e444d5df6b77")
    .send({ age: 99 });

  expect(patch.status).toBe(404);
  expect(patch.body).toBeNull();
});

test("POST /api/users", async () => {
  const post = await request("localhost").post("/api/users").send({
    firstname: "Timmy",
    lastname: "Timmerson",
    age: 19,
    gender: "Male",
  });

  expect(post.status).toBe(201);
  expect(post.body._id).toBeDefined();
  expect(post.body).toMatchObject({
    firstname: "Timmy",
    lastname: "Timmerson",
    age: 19,
    gender: "Male",
  });
});

test("DELETE /api/users/:userId", async () => {
  const del = await request("localhost").delete(
    "/api/users/72398210-5dbb-4566-ada9-e992d8df1b09",
  );

  expect(del.status).toBe(200);
  expect(del.body).toStrictEqual({
    _id: "72398210-5dbb-4566-ada9-e992d8df1b09",
    firstname: "Martha",
    lastname: "Peach",
    age: 32,
    gender: "Female",
  });
});

test("DELETE /api/users/:userId - user not found", async () => {
  const del = await request("localhost").delete(
    "/api/users/00000000-1aaa-2222-bbb3-e444d5df6b77",
  );

  expect(del.status).toBe(404);
  expect(del.body).toBeNull();
});
