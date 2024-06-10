import { http, HttpHandler, HttpResponse } from "msw";
import { v4 as uuidV4 } from "uuid";

// helper to ensure that the handlers work in Node and browser env
const uri = (predicate: string): string => {
  return process.env.NODE_ENV === "test"
    ? `http://localhost${predicate}`
    : predicate;
};

// needed some backing storage for the data being sent to the API,
// and also needed to be able to reset/reseed that storage so that
// I could have had isolated tests. This wrapping function around
// handlers enabled that
export function setupHandlers<T extends Entity<object>>(
  storage: Map<T["_id"], T>,
): HttpHandler[] {
  return [
    http.get<never, never, { data: T[] }>(uri("/api/users"), () => {
      return HttpResponse.json(
        {
          data: Array.from(storage.values()),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }),

    http.get<{ userId: string }, never, T>(
      uri("/api/users/:userId"),
      ({ params }) => {
        const userEntity = storage.get(params.userId);

        // can't find it in storage so respond with Not Found
        if (userEntity === undefined) {
          return HttpResponse.json(null, { status: 404 });
        }

        return HttpResponse.json(userEntity);
      },
    ),

    http.patch<{ userId: string }, Partial<T>, T | Error>(
      uri("/api/users/:userId"),
      async ({ params, request }) => {
        let userEntity = storage.get(params.userId);

        // can't find it in storage so respond with Not Found
        if (userEntity === undefined) {
          return HttpResponse.json(null, { status: 404 });
        }

        try {
          const updatedUser = await request.json();
          userEntity = { ...userEntity, ...updatedUser };

          storage.set(userEntity._id, userEntity);

          return HttpResponse.json(userEntity);
        } catch (err) {
          if (err instanceof Error) {
            return HttpResponse.json(err, { status: 500 });
          } else {
            return HttpResponse.json(new Error("Unknown error"), {
              status: 500,
            });
          }
        }
      },
    ),

    http.post<never, Omit<T, "_id">, T | Error>(
      uri("/api/users"),
      async ({ request }) => {
        try {
          const newUser = await request.json();
          // 🙃 optimisitic!!! schema validation would help here
          const userEntity = { ...newUser, _id: uuidV4() } as unknown as T;

          storage.set(userEntity._id, userEntity);

          return HttpResponse.json(userEntity, { status: 201 });
        } catch (err) {
          if (err instanceof Error) {
            return HttpResponse.json(err, { status: 500 });
          } else {
            return HttpResponse.json(new Error("Unknown error"), {
              status: 500,
            });
          }
        }
      },
    ),

    http.delete<{ userId: string }, never, T>(
      uri("/api/users/:userId"),
      async ({ params }) => {
        const userEntity = storage.get(params.userId);

        // can't find it in storage so respond with Not Found
        if (userEntity === undefined) {
          return HttpResponse.json(null, { status: 404 });
        }

        // we found it and deleted it, return the deleted entity
        if (storage.delete(userEntity._id)) {
          return HttpResponse.json(userEntity, { status: 200 });
        }

        // we did find it, but we couldn't delete it for some reason
        return HttpResponse.json(null, { status: 500 });
      },
    ),
  ];
}
