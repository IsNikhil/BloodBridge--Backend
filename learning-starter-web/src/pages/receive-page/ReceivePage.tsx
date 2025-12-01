import {
  Container,
  Text,
  Card,
  SimpleGrid,
  Button,
  Select,
  TextInput,
  Textarea,
  Modal,
  LoadingOverlay,
  Table,
  Group,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";

type InventoryDto = {
  id: number;
  bloodTypeId: number;
  bloodTypeName: string;
  hospitalId: number;
  hospitalName: string;
  availableUnits: number;
};

type Option = { value: string; label: string };

export const ReceivePage = () => {
  const { classes } = useStyles();

  const [formData, setFormData] = useState({
    requestName: "",
    email: "",
    phone: "",
    bloodType: "",
    hospitalName: "",
    requestNote: "",
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hospitals, setHospitals] = useState<Option[]>([]);
  const [inventory, setInventory] = useState<InventoryDto[]>([]);
  const [bloodOptions, setBloodOptions] = useState<Option[]>([]);
  const [selectedBlood, setSelectedBlood] = useState<string>("");

  // Load all hospitals
  useEffect(() => {
    api.get("/api/hospitals").then((res) => {
      const r: any = res.data;
      const mapped: Option[] = (r?.data ?? []).map((h: any) => ({
        label: h.name,
        value: h.name,
      }));
      setHospitals(mapped);
    });
  }, []);

  // Fetch live blood inventory
  const fetchInventory = () =>
    api.get("/api/bloodinventorys").then((res) => {
      const r: any = res.data;
      const list: InventoryDto[] = r?.data ?? [];
      setInventory(list);

      const unique = Array.from(new Set(list.map((x) => x.bloodTypeName))).sort();
      setBloodOptions(unique.map((name) => ({ value: name, label: name })));
    });

  useEffect(() => {
    fetchInventory();
  }, []);

  // Compute visible rows
  const rows = useMemo(() => {
    const allTypes =
      bloodOptions.length > 0
        ? bloodOptions.map((o) => o.value)
        : ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const filtered =
      selectedBlood !== ""
        ? allTypes.filter((t) => t === selectedBlood)
        : allTypes;

    const sumUnits = (t: string) =>
      inventory
        .filter((x) => x.bloodTypeName === t)
        .reduce((acc, x) => acc + (x.availableUnits ?? 0), 0);

    return filtered.map((type) => ({
      bloodGroup: type,
      units: sumUnits(type),
    }));
  }, [inventory, selectedBlood, bloodOptions]);

  const updateField = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // Submit request
  const submitRequest = async () => {
    try {
      setLoading(true);

      await api.post("/api/requests", {
        requestName: formData.requestName,
        bloodType: formData.bloodType,
        hospitalName: formData.hospitalName,
        requestNote: formData.requestNote,
        requestState: "pending",
      });

      setSuccessOpen(true);
      setFormData({
        requestName: "",
        email: "",
        phone: "",
        bloodType: "",
        hospitalName: "",
        requestNote: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SUCCESS MODAL */}
      <Modal
        opened={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Request Submitted!"
        centered
      >
        <Text>Your emergency request has been submitted successfully.</Text>
      </Modal>

      {/* HERO SECTION */}
      <section className={classes.heroSection}>
        <div className={classes.heroOverlay} />
        <Container size="lg" className={classes.heroContent}>
          <Text className={classes.heroTitle}>
            Facing a blood emergency?
            <br /> Get immediate assistance.
          </Text>
          <Button
            size="lg"
            radius="xl"
            className={classes.heroButton}
            component="a"
            href="tel:5554202025"
          >
            Call Now (555)-420-2025
          </Button>
        </Container>
      </section>

      {/* REQUEST FORM */}
      <Container size="lg" mt={-100} className={classes.requestContainer}>
        <Card radius="lg" p="xl" className={classes.requestBox} shadow="xl">
          <LoadingOverlay visible={loading} />
          <Text className={classes.requestTitle}>
            REQUEST FOR EMERGENCY BLOOD
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Name"
              required
              value={formData.requestName}
              onChange={(e) => updateField("requestName", e.target.value)}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
            <TextInput
              label="Phone"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <Select
              label="Blood Type"
              placeholder="Choose"
              data={bloodOptions}
              value={formData.bloodType}
              onChange={(val) => updateField("bloodType", val || "")}
              searchable
            />
          </SimpleGrid>

          <Select
            mt="md"
            label="Hospital"
            data={hospitals}
            value={formData.hospitalName}
            onChange={(val) => updateField("hospitalName", val || "")}
            searchable
          />

          <Textarea
            mt="md"
            label="Additional Information"
            minRows={3}
            value={formData.requestNote}
            onChange={(e) => updateField("requestNote", e.target.value)}
          />

          <Button
            fullWidth
            size="md"
            mt="xl"
            className={classes.requestButton}
            onClick={submitRequest}
          >
            Submit Request
          </Button>
        </Card>
      </Container>

      {/* STEPS SECTION */}
      <Container size="lg" mt={100}>
        <Text className={classes.sectionSub}>COLLECTING BLOOD</Text>
        <Text className={classes.sectionTitle}>
          From Start To Finish, Here’s What To Expect.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="xl">
          <Card radius="lg" withBorder p="lg" className={classes.stepCard}>
            <Text className={classes.stepNumber}>01</Text>
            <Text fw={700}>Request</Text>
            <Text size="sm" c="dimmed">
              Submit a request for blood and provide your basic details.
            </Text>
          </Card>

          <Card radius="lg" withBorder p="lg" className={classes.stepCard}>
            <Text className={classes.stepNumber}>02</Text>
            <Text fw={700}>Verification</Text>
            <Text size="sm" c="dimmed">
              Our team verifies your request and checks availability.
            </Text>
          </Card>

          <Card radius="lg" withBorder p="lg" className={classes.stepCard}>
            <Text className={classes.stepNumber}>03</Text>
            <Text fw={700}>Receive Blood</Text>
            <Text size="sm" c="dimmed">
              Once approved, you will be guided to collect your blood units.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* BLOOD AVAILABILITY */}
      <Container size="lg" mt={100}>
        <Text className={classes.sectionSub}>WHEN YOU NEED IT</Text>
        <Text className={classes.sectionTitle}>
          Find Available Blood Stock
        </Text>
        <Text ta="center" c="dimmed" mt={4}>
          1 pint / 1 unit of blood = 450 milliliters
        </Text>

        <Card withBorder shadow="md" radius="lg" p="xl" mt="xl">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <Select
              label="Select Blood Group"
              data={bloodOptions}
              value={selectedBlood}
              onChange={(v) => setSelectedBlood(v || "")}
              searchable
            />
            <Group align="end">
              <Button className={classes.searchButton} onClick={fetchInventory}>
                Refresh Availability
              </Button>
            </Group>
          </SimpleGrid>

          <Table striped highlightOnHover mt="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Blood Group</Table.Th>
                <Table.Th>Units Available</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((r) => (
                <Table.Tr key={r.bloodGroup}>
                  <Table.Td>{r.bloodGroup}</Table.Td>
                  <Table.Td>{r.units} units</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Container>

      {/* TIPS SECTION */}
      <Container size="lg" mt={120} mb={100}>
        <Card radius="lg" shadow="md" p="xl" className={classes.tipsCard}>
          <Text className={classes.tipsTitle}>Tips For Managing Blood Loss</Text>
          <ul className={classes.tipsList}>
            <li>Stay calm and avoid strenuous activity.</li>
            <li>Elevate the affected area if possible.</li>
            <li>Apply pressure to slow bleeding.</li>
            <li>Drink water or sports drinks to replace lost fluids.</li>
            <li>Eat iron-rich foods like spinach and beans.</li>
            <li>Follow your doctor's recommendations.</li>
            <li>Track symptoms and seek help if they worsen.</li>
          </ul>
        </Card>
      </Container>
    </>
  );
};

const useStyles = createStyles(() => ({
  heroSection: {
    height: "50vh",
    backgroundImage: "url('/src/assets/images/blood-donation(5).jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  heroOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 },
  heroContent: { zIndex: 2, textAlign: "center" },
  heroTitle: { fontSize: "2rem", color: "white", fontWeight: 700, marginBottom: 20 },
  heroButton: { background: "white !important", color: "#800000 !important", fontWeight: 700 },

  requestContainer: { position: "relative", zIndex: 5 },
  requestBox: { background: "#111", color: "white", borderRadius: "20px", marginTop: 40 },
  requestTitle: { textAlign: "center", fontSize: "1.8rem", fontWeight: 800, marginBottom: 20 },
  requestButton: { backgroundColor: "#b30000 !important", color: "white" },

  sectionSub: { textAlign: "center", color: "#800000", letterSpacing: "2px", fontWeight: 700 },
  sectionTitle: { textAlign: "center", fontSize: "2.2rem", fontWeight: 900, marginTop: 8 },
  searchButton: { backgroundColor: "#000 !important", color: "white !important", fontWeight: 600 },

  stepCard: { textAlign: "center" },
  stepNumber: { fontSize: "2rem", fontWeight: 900, color: "#800000" },

  tipsCard: { backgroundImage: "linear-gradient(120deg,#4B0000,#800000)", color: "white" },
  tipsTitle: { fontSize: "1.9rem", fontWeight: 800, marginBottom: 20 },
  tipsList: { marginLeft: 20, marginTop: 10, lineHeight: 1.7, fontSize: "1rem" },
}));
