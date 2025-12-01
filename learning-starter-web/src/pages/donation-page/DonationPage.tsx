import { useEffect, useState } from "react";
import {
  Container,
  Text,
  TextInput,
  Select,
  Button,
  Card,
  SimpleGrid,
  Image,
  Modal,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";

export const DonationPage = () => {
  const { classes } = useStyles();

  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState("O+");
  const [info, setInfo] = useState("");

  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [hospitalOptions, setHospitalOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // UPDATED: State for the calendar input
  const [selectedDate, setSelectedDate] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Load User Info
  useEffect(() => {
    fetch("https://localhost:5001/api/get-current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        const u = json.data;
        if (!u) return;
        setUserId(u.id);
        if (u.firstName || u.lastName) {
          setName(`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim());
        }
        if (u.email) setEmail(u.email);
        if (u.phoneNumber) setPhone(u.phoneNumber);
        if (u.bloodType) setBloodType(u.bloodType);
      })
      .catch(() => {});
  }, []);

  // 2. Load Hospitals
  useEffect(() => {
    fetch("https://localhost:5001/api/hospitals")
      .then((res) => res.json())
      .then((json) => {
        const data = json.data ?? [];
        const mapped = data.map((h: any) => ({
          value: String(h.id),
          label: `${h.name} — ${h.address}`,
        }));
        setHospitalOptions(mapped);
      })
      .catch(() => {
        setHospitalOptions([]);
      });
  }, []);

  // 3. Handle Submit
  const handleSubmit = async () => {
    if (!userId) {
      setMessage("❗ Please log in before scheduling an appointment.");
      return;
    }
    // Check if date is selected
    if (!name || !email || !phone || !selectedDate || !hospitalId) {
      setMessage("❗ Please fill all fields, choose a hospital and date.");
      return;
    }

    const payload = {
      userId: userId,
      hospitalId: hospitalId,
      // UPDATED: Use the selected date instead of "now"
      date: new Date(selectedDate).toISOString(),
      appointmentType: "Blood Donation",
      status: "Pending",
      info: info,
    };

    try {
      const res = await fetch("https://localhost:5001/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setMessage("❗ There was a problem saving your appointment.");
        return;
      }

      setConfirmOpen(true);
      setMessage("✅ Appointment request submitted.");
      setInfo("");
      // Reset date slightly if needed, or keep it
    } catch {
      setMessage("❗ Could not reach the server.");
    }
  };

  return (
    <>
      <section className={classes.heroSection}>
        <div className={classes.overlay}></div>
        <Container className={classes.heroContent}>
          <Text className={classes.heroSub}>DONATE BLOOD</Text>
          <Text className={classes.heroHeading}>
            Save Life By Donating
            <br />
            Blood Today
          </Text>
        </Container>
      </section>

      <Container size="lg" className={classes.formWrapper}>
        <Card radius="lg" className={classes.formCard}>
          <Text className={classes.formTitle}>SCHEDULE AN APPOINTMENT</Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
            <TextInput
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              className={classes.formInput}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className={classes.formInput}
            />
            <TextInput
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
              className={classes.formInput}
            />
            <Select
              data={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              placeholder="Blood Type"
              value={bloodType}
              onChange={(v) => setBloodType(v || "O+")}
              className={classes.formInput}
            />
          </SimpleGrid>

          {/* UPDATED: Date Picker Input */}
          <Text className={classes.label} mt="md">Select Appointment Date & Time</Text>
          <TextInput
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.currentTarget.value)}
            className={classes.formInput}
            // Prevents selecting past dates
            min={new Date().toISOString().slice(0, 16)} 
          />

          <Select
            mt="md"
            placeholder="Select a Hospital / Donation Center"
            data={hospitalOptions}
            value={hospitalId ? String(hospitalId) : null}
            onChange={(v) => setHospitalId(v ? Number(v) : null)}
            className={classes.formInput}
          />

          <TextInput
            mt="md"
            placeholder="Any other information..."
            value={info}
            onChange={(e) => setInfo(e.currentTarget.value)}
            className={classes.formInput}
          />

          <Button className={classes.submitButton} mt="lg" onClick={handleSubmit}>
            Schedule an Appointment
          </Button>

          {message && (
            <Text ta="center" mt="sm" c={message.startsWith("❗") ? "red" : "green"}>
              {message}
            </Text>
          )}
        </Card>

        <Text ta="center" mt="md" c="dimmed">
          Every drop counts. Fill out the form to schedule your donation.
        </Text>
      </Container>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        centered
        title="Appointment Request Sent"
      >
        <Text>Your appointment request has been submitted.</Text>
        <Text mt="sm">You will receive confirmation once it is approved.</Text>
      </Modal>

      {/* --- Rest of the page (Info Steps, etc.) --- */}
      <Container size="lg" mt={90}>
        <Text className={classes.sectionSub}>DONATION PROCESS</Text>
        <Text className={classes.sectionTitle}>
          Step-By-Step Guide To Donating Blood
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="lg">
          {[
            {
              num: "01",
              title: "Check Your Eligibility",
              desc: "Confirm you meet the eligibility requirements to donate blood.",
            },
            {
              num: "02",
              title: "Schedule An Appointment",
              desc: "Choose a time at a blood bank or drive near you.",
            },
            {
              num: "03",
              title: "Donate Blood",
              desc: "Arrive on time, complete a questionnaire, and donate.",
            },
          ].map((step) => (
            <Card key={step.num} className={classes.stepCard}>
              <div className={classes.stepNumber}>{step.num}</div>
              <Text fw={700}>{step.title}</Text>
              <Text c="dimmed" size="sm">
                {step.desc}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <Container size="lg" mt={90}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <Image
            src="/src/assets/images/blood-donation(7).jpg"
            radius="lg"
            className={classes.sideImage}
          />

          <div>
            <Text className={classes.sectionSub}>DONATE BLOOD TODAY</Text>
            <Text className={classes.sectionTitle}>
              Why Should You Donate Blood?
            </Text>

            <Text mt="sm" c="dimmed">
              Donating blood is a selfless act that saves lives every day.
              One donation can help multiple patients in need.
            </Text>

            <Button mt="lg" className={classes.darkButton}>
              Donate Now
            </Button>
          </div>
        </SimpleGrid>
      </Container>

      <section className={classes.quoteSection}>
        <Text className={classes.quoteText}>
          “By donating blood, you give the gift of life. Join us in this noble cause today!”
        </Text>
      </section>

      <section className={classes.eligibilitySection}>
        <div className={classes.overlay}></div>
        <Container size="lg" className={classes.eligibilityContent}>
          <Text className={classes.sectionSubLight}>ARE YOU READY?</Text>
          <Text className={classes.sectionTitleLight}>Eligibility Criteria</Text>

          <ul className={classes.eligibilityList}>
            <li>18–50 years, above 50 Kg</li>
            <li>Normal temperature, pulse and blood pressure</li>
            <li>No respiratory diseases</li>
            <li>Above 12.5 g/dL hemoglobin</li>
            <li>No skin disease or transmissible infection</li>
          </ul>
        </Container>
      </section>

      <section className={classes.finalCTA}>
        <Text className={classes.finalSub}>BE A HERO, SAVE A LIFE TODAY!</Text>
        <Text className={classes.finalTitle}>Donate Blood, Donate Hope.</Text>

        <Button size="lg" radius="xl" className={classes.whiteButton}>
          Donate Blood Today
        </Button>
      </section>
    </>
  );
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------
const useStyles = createStyles(() => ({
  heroSection: {
    height: "75vh",
    position: "relative",
    backgroundImage: "url('/src/assets/images/blood-donation(1).jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
  },
  heroContent: {
    zIndex: 2,
    textAlign: "center",
    color: "white",
  },
  heroSub: {
    fontSize: "1rem",
    letterSpacing: "3px",
    color: "#ffcccc",
  },
  heroHeading: {
    fontSize: "3rem",
    fontWeight: 900,
    marginTop: 10,
  },
  formWrapper: {
    marginTop: -60,
    marginBottom: 40,
  },
  formCard: {
    background: "#111",
    padding: "40px",
    borderRadius: "20px",
  },
  formTitle: {
    textAlign: "center",
    fontSize: "1.2rem",
    letterSpacing: "2px",
    color: "white",
    marginBottom: 10,
  },
  label: {
    color: "#ccc",
    fontSize: "0.9rem",
    marginBottom: "5px",
  },
  formInput: {
    "& input": {
      height: 52,
      fontSize: 15,
      // Fix for calendar icon in dark mode if needed
      colorScheme: "dark", 
    },
  },
  submitButton: {
    backgroundColor: "white !important",
    color: "#800000 !important",
    width: "100%",
    fontWeight: 700,
    height: 48,
  },
  sectionSub: {
    color: "#800000",
    letterSpacing: "2px",
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: "2.4rem",
    fontWeight: 900,
  },
  stepCard: {
    textAlign: "center",
    padding: "25px",
    backgroundColor: "var(--mantine-color-body)",
  },
  stepNumber: {
    backgroundColor: "#800000",
    color: "white",
    width: 50,
    height: 50,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "1.1rem",
    margin: "0 auto 10px",
  },
  sideImage: {
    height: "370px",
    objectFit: "cover",
  },
  darkButton: {
    backgroundColor: "#800000 !important",
  },
  quoteSection: {
    marginTop: 90,
    background: "linear-gradient(120deg,#4B0000,#800000)",
    padding: "60px 10%",
    borderRadius: "15px",
    textAlign: "center",
  },
  quoteText: {
    color: "white",
    fontSize: "1.3rem",
    fontStyle: "italic",
  },
  eligibilitySection: {
    marginTop: 90,
    padding: "120px 0",
    backgroundImage: "url('/src/assets/images/blood-donation(5).jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    color: "white",
  },
  eligibilityContent: {
    position: "relative",
    zIndex: 2,
  },
  sectionSubLight: {
    color: "#ffcccc",
    letterSpacing: "2px",
  },
  sectionTitleLight: {
    fontSize: "2.4rem",
    fontWeight: 900,
  },
  eligibilityList: {
    marginTop: 20,
    lineHeight: 1.9,
    fontSize: "1rem",
  },
  finalCTA: {
    marginTop: 90,
    padding: "110px 20px",
    background: "linear-gradient(120deg,#4B0000,#800000)",
    textAlign: "center",
    color: "white",
  },
  finalSub: {
    letterSpacing: "2px",
  },
  finalTitle: {
    fontSize: "2.5rem",
    fontWeight: 900,
    marginBottom: 25,
  },
  whiteButton: {
    backgroundColor: "white !important",
    color: "#800000 !important",
    fontWeight: 700,
  },
}));