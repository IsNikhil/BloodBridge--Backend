import {
  Button,
  Container,
  Text,
  Group,
  Card,
  SimpleGrid,
  Image,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { Link } from "react-router-dom";
import { PageWrapper } from "../../components/page-wrapper/page-wrapper";


export const HomePage = () => {
  const { classes } = useStyles();

  return (
    <>


      {/* HERO SECTION */}
      <section className={classes.heroSection}>
        <div className={classes.overlay}></div>

        <Container className={classes.heroContent}>
          <Text className={classes.heroSubTitle}>GIVE THE GIFT OF LIFE</Text>

          <Text className={classes.heroHeading}>
            Your Blood Can Make <br /> A Difference
          </Text>

          <Group mt="lg" className={classes.heroButtons}>
            <Button
              size="lg"
              radius="xl"
              component={Link}
              to="/donation"
              className={classes.primaryButton}
            >
              Donate Blood
            </Button>

            <Button
              size="lg"
              radius="xl"
              variant="outline"
              component={Link}
              to="/request"
              className={classes.secondaryButton}
            >
              Request Blood
            </Button>
          </Group>
        </Container>
      </section>

      {/* DONATE / REQUEST CARDS */}
      <Container size="lg" mt={90}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">

          {/* Donate Card */}
          <Card className={`${classes.optionCard} ${classes.cardHover}`} bg="transparent" shadow="none">
            <Image
              src="/src/assets/images/blood-donation(1).jpg"
              alt="Donate Blood"
              className={classes.optionImage}
            />
            <div className={classes.optionOverlay} />
            <div className={classes.optionContent}>
              <Text className={classes.optionSub}>SAVE A LIFE TODAY</Text>
              <Text className={classes.optionTitle}>Donate Blood At BloodBridge</Text>
              <Button component={Link} to="/donation" className={classes.whiteButton}>
                Donate Blood
              </Button>
            </div>
          </Card>

          {/* Request Card */}
          <Card className={`${classes.optionCard} ${classes.cardHover}`} bg="transparent" shadow="none">
            <Image
              src="/src/assets/images/blood-donation(2).jpg"
              alt="Request Blood"
              className={classes.optionImage}
            />
            <div className={classes.optionOverlay} />
            <div className={classes.optionContent}>
              <Text className={classes.optionSub}>URGENT NEED FOR BLOOD</Text>
              <Text className={classes.optionTitle}>Request For Blood Donation</Text>
              <Button component={Link} to="/request" className={classes.whiteButton}>
                Request Blood
              </Button>
            </div>
          </Card>

        </SimpleGrid>
      </Container>

      {/* QUOTE SECTION */}
      <section className={classes.quoteSection}>
        <Text className={classes.quoteText}>
          “The blood you donate gives someone another chance at life. One day that
          someone may be a close relative, a friend, a loved one—or even you.”
        </Text>
      </section>

      {/* WHY DONATE */}
      <Container size="lg" mt={90}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <Image
            src="/src/assets/images/blood-donation(7).jpg"
            alt="Why Donate"
            radius="lg"
            className={classes.whyImage}
          />

          <div>
            <Text className={classes.sectionSub}>DONATE BLOOD TODAY</Text>
            <Text className={classes.sectionTitle}>Why Should You Donate Blood?</Text>

            <Text mt="sm" c="dimmed">
              Donating blood is a selfless act that has the power to save lives.
              Blood is always needed in emergencies and hospitals.
              You can help save up to three lives with one donation.
            </Text>

            <Button mt="lg" className={classes.primaryButton}>
              Donate Now
            </Button>
          </div>
        </SimpleGrid>
      </Container>
      {/* STEP-BY-STEP PROCESS SECTION */}
<Container size="xl" mt={100}>
  <Text
    style={{
      color: "#800000",
      letterSpacing: "2px",
      fontWeight: 700,
      marginBottom: "8px",
    }}
  >
    DONATION PROCESS
  </Text>

  <Text
    style={{
      fontSize: "2.6rem",
      fontWeight: 900,
      marginBottom: "40px",
    }}
  >
    Step-By-Step Guide To Donating Blood
  </Text>

  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
    {/* Step 1 */}
    <Card radius="lg" withBorder p="lg" style={{ textAlign: "center" }}>
      <Text
        style={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#800000",
          marginBottom: "10px",
        }}
      >
        01
      </Text>

      <Text fw={700}>Check Your Eligibility</Text>

      <Text size="sm" c="dimmed">
        Confirm you meet the eligibility requirements to donate blood, such as
        age, weight, and overall health.
      </Text>
    </Card>

    {/* Step 2 */}
    <Card radius="lg" withBorder p="lg" style={{ textAlign: "center" }}>
      <Text
        style={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#800000",
          marginBottom: "10px",
        }}
      >
        02
      </Text>

      <Text fw={700}>Schedule An Appointment</Text>

      <Text size="sm" c="dimmed">
        Schedule an appointment at a blood bank or blood drive near you.
      </Text>
    </Card>

    {/* Step 3 */}
    <Card radius="lg" withBorder p="lg" style={{ textAlign: "center" }}>
      <Text
        style={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#800000",
          marginBottom: "10px",
        }}
      >
        03
      </Text>

      <Text fw={700}>Donate Blood</Text>

      <Text size="sm" c="dimmed">
        Arrive at the appointment, fill out a questionnaire, and donate blood.
        The process takes about 10–15 minutes.
      </Text>
    </Card>
  </SimpleGrid>
</Container>


 {/* ELIGIBILITY SECTION */}
<section className={classes.eligibilitySection}>
  <div className={classes.eligibilityOverlay}></div>

  <Container size="lg">
    <Card className={classes.eligibilityCard} radius="lg" shadow="md" padding="xl">
      <Text className={classes.sectionSubDark}>ARE YOU READY?</Text>
      <Text className={classes.sectionTitleDark}>Eligibility Criteria</Text>

      <ul className={classes.eligibilityList}>
        <li>18–50 years, above 50 Kg</li>
        <li>Normal temperature, pulse and blood pressure</li>
        <li>No respiratory diseases</li>
        <li>Above 12.5 g/dL hemoglobin</li>
        <li>No skin disease or transmissible infection</li>
      </ul>
    </Card>
  </Container>
</section>

{/* FINAL CTA */}
<section className={classes.finalCTA}>
  <Text className={classes.finalSub}>BE A HERO, SAVE A LIFE TODAY!</Text>
  <Text className={classes.finalTitle}>Donate Blood, Donate Hope.</Text>

  <Button
    size="lg"
    radius="xl"
    className={classes.whiteButton}
    component={Link}
    to="/donation"
  >
    Donate Blood Today
  </Button>
</section>
    </>
  );
}
const useStyles = createStyles(() => ({
  /* HERO */
  heroSection: {
    height: "92vh",
    position: "relative",
    backgroundImage: "url('/src/assets/images/blood-donation(3).jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 1,
  },
  heroContent: {
    zIndex: 2,
    textAlign: "center",
  },
  heroSubTitle: {
    fontSize: "1rem",
    letterSpacing: "3px",
    color: "#ffcccc",
    marginBottom: 8,
  },
  heroHeading: {
    fontSize: "3.8rem",
    fontWeight: 900,
    lineHeight: 1.2,
  },
  heroButtons: {
    justifyContent: "center",
  },

  /* BUTTONS */
  primaryButton: {
    backgroundColor: "#800000 !important",
    fontWeight: 700,
  },
  secondaryButton: {
    color: "#fff !important",
    borderColor: "#fff !important",
  },
  whiteButton: {
    backgroundColor: "white !important",
    color: "#800000 !important",
    fontWeight: 700,
  },

  /* CARDS — FIXED TO MATCH HEMOCELL */
  optionCard: {
    position: "relative",
    height: "330px",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
  },

  optionImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.35s ease",
  },

  cardHover: {
    "&:hover img": {
      transform: "scale(1.08)",
    },
  },

  optionOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.7))",
    zIndex: 1,
  },

  optionContent: {
    position: "absolute",
    bottom: "22px",
    left: "22px",
    zIndex: 2,
    color: "white",
  },

  optionSub: {
    fontSize: "0.75rem",
    letterSpacing: "1.5px",
    marginBottom: "5px",
    opacity: 0.85,
  },

  optionTitle: {
    fontSize: "1.55rem",
    fontWeight: 800,
    marginBottom: "12px",
    lineHeight: 1.2,
  },

  /* QUOTE */
  quoteSection: {
    marginTop: 90,
    textAlign: "center",
    background: "linear-gradient(120deg,#4B0000,#800000)",
    padding: "60px 10%",
    borderRadius: "15px",
  },
  quoteText: {
    color: "white",
    fontSize: "1.3rem",
    fontStyle: "italic",
  },

  /* WHY DONATE */
  whyImage: {
    height: "380px",
    objectFit: "cover",
  },
  sectionSub: {
    color: "#800000",
    letterSpacing: "2px",
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: "2.4rem",
    fontWeight: 900,
  },
  

 /* ELIGIBILITY  */
eligibilitySection: {
  marginTop: 120,
  padding: "120px 0",
  backgroundImage: "url('/src/assets/images/blood-donation(5).jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
},

eligibilityOverlay: {
  position: "absolute",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(2px)",
  zIndex: 1,
},

eligibilityCard: {
  position: "relative",
  zIndex: 2,
  backgroundColor: "rgba(255,255,255,0.9) !important",
  backdropFilter: "blur(4px)",
  borderRadius: "20px",
  padding: "40px",
  boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
},

sectionSubDark: {
  color: "#800000",
  letterSpacing: "2px",
  fontWeight: 700,
  marginBottom: 10,
},

sectionTitleDark: {
  fontSize: "2.5rem",
  fontWeight: 900,
  marginBottom: 20,
  color: "#000",
},

eligibilityList: {
  marginTop: 10,
  lineHeight: 1.9,
  fontSize: "1.1rem",
  color: "#333",
},


  /* FINAL CTA */
  finalCTA: {
    marginTop: 100,
    padding: "110px 20px",
    background: "linear-gradient(120deg,#4B0000,#800000)",
    textAlign: "center",
    color: "white",
  },
  finalSub: {
    letterSpacing: "3px",
  },
  finalTitle: {
    fontSize: "2.8rem",
    fontWeight: 900,
    marginBottom: 25,
  },
}));
