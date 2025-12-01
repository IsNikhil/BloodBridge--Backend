import { ApiResponse } from "../../constants/types";
import { useAsyncFn } from "react-use";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";
import { FormErrors, useForm } from "@mantine/form";
import {
  Alert,
  Button,
  Container,
  Input,
  Text,
  Card,
} from "@mantine/core";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { createStyles } from "@mantine/emotion";
import { Link, useNavigate } from "react-router-dom";

type LoginRequest = {
  userName: string;
  password: string;
};

type LoginResponse = ApiResponse<boolean>;

export const LoginPage = ({ fetchCurrentUser }: { fetchCurrentUser: () => void }) => {
  const styles = useStyles();
  const { classes } = styles;
  const navigate = useNavigate();

  const form = useForm<LoginRequest>({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: {
      userName: (value) =>
        value.trim().length === 0 ? "Username must not be empty" : null,
      password: (value) =>
        value.trim().length === 0 ? "Password must not be empty" : null,
    },
  });

  const [,submitLogin] = useAsyncFn(async (values: LoginRequest) => {
    const response = await api.post<LoginResponse>(`/api/authenticate`, values);

    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      form.setErrors(formErrors);
      return;
    }

    if (response.data.data) {
      showNotification({ message: "Successfully Logged In!", color: "green" });
      fetchCurrentUser();
      console.log("Navigating to /home");
      navigate("/home"); 
    }
  }, []);

  return (
    <PageWrapper>
      <Container size={420} my={80}>
        <Card shadow="md" padding="xl" radius="md" className={classes.card}>
          <Text size="xl" fw={700} ta="center" mb="md">
            Welcome Back
          </Text>

          <Text ta="center" c="dimmed" mb="lg">
            Login to access your BloodBridge account
          </Text>

          {form.errors[""] && (
            <Alert className={classes.generalErrors} color="red">
              <Text>{form.errors[""]}</Text>
            </Alert>
          )}

          <form onSubmit={form.onSubmit(submitLogin)}>
            <div className={classes.field}>
              <label htmlFor="userName">Username</label>
              <Input {...form.getInputProps("userName")} />
              <Text c="red">{form.errors["userName"]}</Text>
            </div>

            <div className={classes.field}>
              <label htmlFor="password">Password</label>
              <Input type="password" {...form.getInputProps("password")} />
              <Text c="red">{form.errors["password"]}</Text>
            </div>

            <Button className={classes.loginButton} type="submit" fullWidth>
              Login
            </Button>
          </form>

          <Text ta="center" mt="md">
            New user?{" "}
            <Link to="/signup" className={classes.link}>
              Sign up here
            </Link>
          </Text>
        </Card>
      </Container>
    </PageWrapper>
  );
};

const useStyles = createStyles(() => ({
  card: {
    background: "#fafafa",
    padding: 30,
  },
  generalErrors: {
    marginBottom: 10,
  },
  field: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 12,
    backgroundColor: "#800000 !important",
    color: "white !important",
    fontWeight: 700,
  },
  link: {
    color: "#800000",
    fontWeight: 600,
    textDecoration: "none",
  },
}));
