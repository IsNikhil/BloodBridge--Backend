import { useState } from "react";
import {
  Container,
  Text,
  TextInput,
  Textarea,
  Button,
  Card,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";

export const ContactPage = () => {
  const { classes } = useStyles();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setStatus("Please fill in all required fields.");
      return;
    }

    const subject = encodeURIComponent(
      `Contact Form: ${formData.reason || "General Inquiry"}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:help@bb.test?subject=${subject}&body=${body}`;
  };

  return (
    <PageWrapper>
      <div className={classes.wrapper}>
        <Container size="md">
          <div className={classes.header}>
            <Text className={classes.title}>We’re Here to Help</Text>
            <Text c="dimmed" className={classes.subtitle}>
              Fill out the form below and we’ll get back to you soon.
            </Text>
          </div>

          <Card withBorder radius="md" shadow="sm" p="xl" className={classes.formCard}>
            <form onSubmit={handleSubmit}>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Name"
                  placeholder="Enter your full name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextInput
                  label="Phone"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <TextInput
                  label="Reason"
                  placeholder="Reason for contacting"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </SimpleGrid>

              <Textarea
                label="Message"
                placeholder="Type your message here..."
                name="message"
                value={formData.message}
                onChange={handleChange}
                minRows={4}
                mt="md"
              />

              <Button type="submit" color="red" radius="md" size="md" mt="lg" fullWidth>
                Send Message
              </Button>

              {status && (
                <Text ta="center" mt="md" c={status.includes("✅") ? "green" : "red"}>
                  {status}
                </Text>
              )}
            </form>
          </Card>

          <Container size="sm" mt={60}>
            <Divider mb="md" label="Contact Details" labelPosition="center" />
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="md">
              <div className={classes.contactItem}>
                <div className={classes.icon}>📞</div>
                <Text fw={600}>Phone</Text>
                <Text size="sm" c="dimmed">
                  (555) 420-2025
                </Text>
              </div>

              <div className={classes.contactItem}>
                <div className={classes.icon}>✉️</div>
                <Text fw={600}>Email</Text>
                <Text size="sm" c="dimmed">
                  help@bb.test
                </Text>
              </div>

              <div className={classes.contactItem}>
                <div className={classes.icon}>📍</div>
                <Text fw={600}>Address</Text>
                <Text size="sm" c="dimmed">
                  Hammond, LA, USA
                </Text>
              </div>
            </SimpleGrid>
          </Container>
        </Container>
      </div>
    </PageWrapper>
  );
};

const useStyles = createStyles(() => ({
  wrapper: {
    marginTop: 90,
    marginBottom: 60,
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#7b0000",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
  },
  formCard: {
    backgroundColor: "var(--mantine-color-body)",
  },
  contactItem: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
}));
