import { Dispatch, SetStateAction } from "react";

// moved all network request handling into this dedicated module
// N.B. - the implementation of the functions is barebones and not
// production-grade (e.g. response handling, error handling) but
// API could be considered somewhat stable, and the clear separation
// hopefully conveys intent and improves overall comprehension

export const getUsers = (
  callback: Dispatch<SetStateAction<Map<string, User>>>,
) => {
  return fetch("/api/users")
    .then((res) => res.json())
    .then(({ data }: { data: User[] }) => {
      callback(new Map(data.map((u) => [u._id, u])));
    })
    .catch((err) => console.error(err));
};

export const updateUser = (
  user: User,
  callback: Dispatch<SetStateAction<Map<string, User>>>,
) => {
  return fetch(`/api/users/${user._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((u: User) => callback((users) => new Map(users.set(u._id, u))))
    .catch((err) => console.error(err));
};

export const addUser = (
  user: User,
  callback: Dispatch<SetStateAction<Map<string, User>>>,
) => {
  return fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((u: User) => callback((users) => new Map(users.set(u._id, u))))
    .catch((err) => console.error(err));
};

export const deleteUser = (
  user: User,
  callback: Dispatch<SetStateAction<Map<string, User>>>,
) => {
  fetch(`/api/users/${user._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((u: User) => {
      callback((users) => {
        users.delete(u._id);
        return new Map(users);
      });
    })
    .catch((err) => console.error(err));
};
