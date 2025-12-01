import { Container, Text, SimpleGrid, Anchor, Divider } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { classes } = useStyles();

  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        {/* Left: Logo + tagline */}
        <div>
          <Text fw={700} className={classes.logo}>
            <span className={classes.heart}></span> Blood
            <span className={classes.red}>Bridge</span>
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            You don’t have to be a doctor to save a life — just donate blood.
          </Text>
        </div>

        {/* Explore section */}
        <div>
          <Text fw={600} className={classes.sectionTitle}>
            EXPLORE
          </Text>
          <SimpleGrid cols={1} mt={6} spacing={4}>
            <Anchor component={Link} to="/donation" className={classes.link}>
              Donate Blood
            </Anchor>
            <Anchor component={Link} to="/request" className={classes.link}>
              Receive Blood
            </Anchor>
            <Anchor component={Link} to="/contact" className={classes.link}>
              Contact
            </Anchor>
            <Anchor component={Link} to="https://donorbox.org/your-donation-can-save-lives-donate-now" className={classes.link}>
            Support Us
            </Anchor>
          </SimpleGrid>
        </div>

        {/* Contact section */}
{/* Contact section */}
<div>
  <Text fw={600} className={classes.sectionTitle}>
    CONTACT
  </Text>

  <SimpleGrid cols={1} mt={6} spacing={4}>

    {/* Click-to-call */}
    <Text
      size="sm"
      c="dimmed"
      component="a"
      href="tel:5554202025"
      style={{ textDecoration: "none" }}
    >
      (555)-420-2025
    </Text>

    {/* Click-to-email */}
    <Text
      size="sm"
      c="dimmed"
      component="a"
      href="mailto:help@bb.test"
      style={{ textDecoration: "none" }}
    >
      help@bb.test
    </Text>

    {/* Click to open Google Maps at SLU CS Building */}
    <Text
      size="sm"
      c="dimmed"
      component="a"
      href="https://www.google.com/maps?q=Southeastern+Louisiana+University+Computer+Science+Building"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      Hammond, LA
    </Text>

    {/* Hours (non-clickable) */}
    <Text size="sm" c="dimmed">
      Open 24/7
    </Text>
  </SimpleGrid>
</div>

      </Container>

      <Divider mt="xl" mb="sm" color="rgba(255,255,255,0.2)" />
      <Container size="lg" className={classes.bottom}>
        <Text size="xs" c="dimmed">
          © 2025 BloodBridge -Group 8
        </Text>
      </Container>
    </footer>
  );
};

const useStyles = createStyles(() => ({
  footer: {
    background: "linear-gradient(to top, #0b0b0b 85%, #1a0000 100%)",
    color: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    marginTop: 80,
  },
  inner: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "2rem",
  },
  logo: {
    fontSize: 22,
    color: "#fff",
  },
  heart: {
    color: "#e03131",
    marginRight: 4,
  },
  red: {
    color: "#e03131",
  },
  sectionTitle: {
    color: "#e03131",
    fontSize: 14,
    letterSpacing: "1px",
  },
  link: {
    fontSize: 14,
    color: "#fff",
    textDecoration: "none",
    "&:hover": { color: "#e03131" },
  },
  bottom: {
    textAlign: "center",
    marginTop: 10,
  },
}));
