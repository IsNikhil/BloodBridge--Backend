import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Card,
  Container,
  Input,
  Select,
  Text,
  Title,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/use-auth";

type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  userType: string;
  bloodType: string;
  createDate: string;
  updateDate: string;
  lastDonationDate: string;
  userName: string;
  password: string;
};

type SignupResponse = ApiResponse<boolean>;

export const SignupPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const form = useForm<SignupRequest>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      userType: "Donor",
      bloodType: "O+",
      createDate: "",
      updateDate: "",
      lastDonationDate: "",
      userName: "",
      password: "",
    },
    validate: {
      firstName: (v) => (!v ? "Required" : null),
      lastName: (v) => (!v ? "Required" : null),
      email: (v) => (!v ? "Required" : null),
      phoneNumber: (v) => (!v ? "Required" : null),
      dateOfBirth: (v) => (!v ? "Required" : null),
      gender: (v) => (!v ? "Required" : null),
      userName: (v) => (!v ? "Required" : null),
      password: (v) => (!v ? "Required" : null),
    },
  });

  const [, submitSignup] = useAsyncFn(async (values: SignupRequest) => {
    const now = new Date().toISOString();

    const payload: SignupRequest = {
      ...values,
      createDate: now,
      updateDate: now,
      lastDonationDate: now,
    };

    // 1) CREATE USER
    const response = await api.post<SignupResponse>("/api/users", payload);

    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (acc, err) => {
          acc[err.property] = err.message;
          return acc;
        },
        {} as FormErrors
      );
      form.setErrors(formErrors);
      return;
    }

    showNotification({
      message: "Account created! Logging you in...",
      color: "green",
    });

    // 2) AUTO LOGIN
    await api.post("/api/authenticate", {
      userName: values.userName,
      password: values.password,
    });

    // 3) REFRESH USER CONTEXT
    await refetchUser();

    // 4) REDIRECT TO HOME
    navigate("/home");
  }, []);

  return (
    <PageWrapper>
      <Container className={classes.centerWrapper}>
        <Card shadow="lg" radius="lg" className={classes.card}>
          <Title order={2} ta="center" mb="xs">
            Create an Account
          </Title>
          <Text ta="center" c="dimmed" mb="lg">
            Join BloodBridge and start saving lives.
          </Text>

          {form.errors[""] && (
            <Alert color="red" mb="md">
              {form.errors[""]}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(submitSignup)}>
            {[
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "address",
              "dateOfBirth",
              "userName",
            ].map((field) => (
              <div key={field} className={classes.field}>
                <Text fw={500}>{field.replace(/([A-Z])/g, " $1")}</Text>
                <Input {...form.getInputProps(field)} size="md" />
              </div>
            ))}

            <div className={classes.field}>
              <Text fw={500}>Gender</Text>
              <Select
                data={["Male", "Female", "Other"]}
                {...form.getInputProps("gender")}
              />
            </div>

            <div className={classes.field}>
              <Text fw={500}>User Type</Text>
              <Select
                data={["Donor", "Recipient", "Admin"]}
                {...form.getInputProps("userType")}
              />
            </div>

            <div className={classes.field}>
              <Text fw={500}>Blood Type</Text>
              <Select
                data={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                {...form.getInputProps("bloodType")}
              />
            </div>

            <div className={classes.field}>
              <Text fw={500}>Password</Text>
              <Input
                type="password"
                {...form.getInputProps("password")}
                size="md"
              />
            </div>

            <Button type="submit" fullWidth size="md" className={classes.submitButton}>
              Create Account
            </Button>

            <Text ta="center" mt="md" c="dimmed">
              Already have an account?{" "}
              <Link to="/login" className={classes.link}>
                Login here
              </Link>
            </Text>
          </form>
        </Card>
      </Container>
    </PageWrapper>
  );
};

const useStyles = createStyles(() => ({
  centerWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 60,
  },
  card: {
    width: 500,
    padding: 35,
    background: "#fafafa",
    borderRadius: 16,
  },
  field: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: "#800000 !important",
    color: "white !important",
    fontWeight: 700,
    height: 45,
  },
  link: {
    color: "#800000",
    fontWeight: 600,
    textDecoration: "none",
  },
}));
