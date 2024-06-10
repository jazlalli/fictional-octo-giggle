import { useEffect, useState } from "react";
import { Button, Flex, Heading, IconButton, Table } from "@radix-ui/themes";
import { PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { UserFormDialog } from "./components/UserFormDialog";
import * as api from "./apiClient";
import "./App.css";

function App() {
  // tracked the Users in state in a Map, for fast find and write/update
  const [users, setUsers] = useState<Map<User["_id"], User>>(new Map());

  useEffect(() => {
    api.getUsers(setUsers);
  }, [setUsers]);

  const handleEditUser = (user: User) => {
    api.updateUser(user, setUsers);
  };

  const handleAddUser = (user: User) => {
    api.addUser(user, setUsers);
  };

  const handleConfirmDeleteUser = (user: User) => {
    api.deleteUser(user, setUsers);
  };

  return (
    <Flex className="page" direction="column" gapY="6">
      <Flex justify="between" align="center" asChild>
        <nav>
          <Heading size="8">Users</Heading>
          <UserFormDialog
            title="Add user"
            trigger={
              <Button variant="solid" radius="full">
                <PersonIcon />
                Add user
              </Button>
            }
            onSubmit={(user: User) => handleAddUser(user)}
          />
        </nav>
      </Flex>
      <main>
        <Table.Root className="users-table" variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Gender</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>First name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array.from(users.values()).map((u: User) => (
              <Table.Row key={`${u.firstname} ${u.lastname}`}>
                <Table.Cell>{u.gender}</Table.Cell>
                <Table.Cell>{u.firstname}</Table.Cell>
                <Table.Cell>{u.lastname}</Table.Cell>
                <Table.Cell>{u.age}</Table.Cell>
                <Table.Cell>
                  <UserFormDialog
                    title="Edit user"
                    user={u}
                    trigger={
                      <Button size="1" variant="soft">
                        Edit
                      </Button>
                    }
                    onSubmit={(updated: User) =>
                      handleEditUser({ ...u, ...updated })
                    }
                  />

                  <ConfirmDialog
                    trigger={
                      <IconButton size="1" variant="soft">
                        <TrashIcon width="18" height="18" />
                      </IconButton>
                    }
                    title="Delete user?"
                    description="Are you sure you want to delete this user?"
                    confirmText="Delete"
                    onConfirm={() => handleConfirmDeleteUser(u)}
                  ></ConfirmDialog>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </main>
    </Flex>
  );
}

export default App;
