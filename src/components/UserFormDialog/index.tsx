import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Callout,
  Dialog,
  Button,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type UserFormDialogProps = {
  title: string;
  trigger: React.ReactElement;
  user?: User;
  onSubmit: (user: User) => void;
  onCancel?: () => void;
};

// the form only deals in strings, so need a User shaped type
// with all properties as string
type UserFormData = { [K in keyof User]: string };

// predicate for narrowing a string to Gender
function isGender(gender: string): gender is Gender {
  return gender === "Male" || gender === "Female";
}

// helper for morphing form data into a User
function parseUser(data: UserFormData): User {
  const age = parseInt(data.age, 10);

  if (isGender(data.gender) && Number.isInteger(age)) {
    const user: User = {
      _id: data._id,
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      age: age,
    };

    return user;
  }

  throw new Error(
    `ParserError: Expected to parse valid user data. Received: ${data}`,
  );
}

export const UserFormDialog = ({
  title,
  trigger,
  user,
  onSubmit,
  onCancel = () => void 0,
}: UserFormDialogProps) => {
  const [open, setOpen] = useState(false);

  // set default values from the supplied user, with empty strings as
  // falling back values. can't use null | undefined here as that breaks
  // the form
  const defaultFormValues = {
    _id: user?._id ?? "",
    gender: user?.gender ?? "",
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    age: user?.age.toString() ?? "",
  };

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<UserFormData>({
    defaultValues: defaultFormValues,
  });

  // values for the controlled form inputs
  const gender = watch("gender");
  const firstname = watch("firstname");
  const lastname = watch("lastname");
  const age = watch("age");

  // register form inputs along with their validation rules
  useEffect(() => {
    register("gender", {
      required: { value: true, message: "Required" },
    });

    register("firstname", {
      required: { value: true, message: "Required" },
      pattern: {
        value: /^[a-zA-Z\-'\s]*$/,
        message:
          "First names can only contain letters, hyphens (-), and apostrophes (')",
      },
      minLength: {
        value: 5,
        message: "First names must be longer than 5 characters",
      },
      maxLength: {
        value: 20,
        message: "First names must be shorter than 20 characters",
      },
    });

    register("lastname", {
      required: { value: true, message: "Required" },
      pattern: {
        value: /^[a-zA-Z\-'\s]*$/,
        message:
          "Last names can only contain letters, hyphens (-), and apostrophes (')",
      },
      minLength: {
        value: 5,
        message: "Last names must be longer than 5 characters",
      },
      maxLength: {
        value: 20,
        message: "Last names must be shorter than 20 characters",
      },
    });

    register("age", {
      required: { value: true, message: "Required" },
      pattern: {
        value: /^[0-9]*$/,
        message: "Age must be a number",
      },
      min: {
        value: 18,
        message: "Users must be 18 or over",
      },
      max: {
        value: gender === "Male" ? 112 : 117,
        message:
          gender === "Male"
            ? "The maximum age for male users is 112"
            : "The maximum age for female users is 117",
      },
    });
  }, [register, gender]);

  useEffect(() => {
    // errors were being retained between form open/close
    // so this ensures they're cleaned up
    if (open) {
      clearErrors();
    }
  }, [open, clearErrors]);

  const onFormSubmit = handleSubmit((data) => {
    try {
      const user = parseUser(data);
      onSubmit(user);
      setOpen(false);

      // if a new user was submitted reset the form now
      if (user._id === "") {
        reset(defaultFormValues);
      }
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{title}</Dialog.Title>

        <form onSubmit={onFormSubmit} aria-label="Add user form">
          <Flex direction="column" gap="3">
            {Object.keys(errors).length > 0 && (
              <Callout.Root color="red">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>
                  Please correct the errors and try again.
                </Callout.Text>
              </Callout.Root>
            )}

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Gender
              </Text>
              <Select.Root
                value={gender}
                onValueChange={(value: Gender) => setValue("gender", value)}
              >
                <Select.Trigger
                  placeholder="Select gender"
                  color={errors.gender ? "red" : undefined}
                  variant={errors.gender ? "soft" : undefined}
                />
                <Select.Content>
                  <Select.Item value="Male">Male</Select.Item>
                  <Select.Item value="Female">Female</Select.Item>
                </Select.Content>
              </Select.Root>
              {errors.gender && (
                <Text as="div" size="2" mb="1" color="red">
                  {errors.gender.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                First name
              </Text>
              <TextField.Root
                placeholder="Enter first name"
                value={firstname}
                onChange={(evt) =>
                  setValue("firstname", evt.currentTarget.value)
                }
                color={errors.firstname ? "red" : undefined}
                variant={errors.firstname ? "soft" : undefined}
              />
              {errors.firstname && (
                <Text as="div" size="2" mb="1" color="red">
                  {errors.firstname.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Last name
              </Text>
              <TextField.Root
                placeholder="Enter last name"
                value={lastname}
                onChange={(evt) =>
                  setValue("lastname", evt.currentTarget.value)
                }
                color={errors.lastname ? "red" : undefined}
                variant={errors.lastname ? "soft" : undefined}
              />
              {errors.lastname && (
                <Text as="div" size="2" mb="1" color="red">
                  {errors.lastname.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Age
              </Text>
              <TextField.Root
                placeholder="Enter age"
                value={age}
                onChange={(evt) => setValue("age", evt.currentTarget.value)}
                color={errors.age ? "red" : undefined}
                variant={errors.age ? "soft" : undefined}
              />
              {errors.age && (
                <Text as="div" size="2" mb="1" color="red">
                  {errors.age.message}
                </Text>
              )}
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button
              variant="soft"
              color="gray"
              onClick={(evt) => {
                evt.preventDefault();
                onCancel();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save user
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
