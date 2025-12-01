// ========================================================
// ADMIN DASHBOARD — FINAL STABLE VERSION
// ========================================================

import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  Container,
  Paper,
  SimpleGrid,
  Table,
  Badge,
  Button,
  Modal,
  Select,
  NumberInput,
  TextInput,
  Avatar,
  Title,
  ScrollArea,
  LoadingOverlay,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import api from "../../config/axios";

// ----------------------
// Types
// ----------------------
interface ApiResponse<T> {
  data: T;
}

type InventoryRow = {
  id: number;
  hospitalId: number;
  hospitalName?: string;
  bloodTypeId: number;
  bloodTypeName?: string;
  availableUnits: number;
};

type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bloodType: string;
  role: string;
};

type AppointmentDto = {
  id: number;
  userId: number;
  hospitalId: number;
  appointmentType: string;
  status: string;
  date: string;
  info: string;

  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone?: string;
  hospitalEmail?: string;

  appointmentMadeBy?: string;
  appointmentMakerEmail?: string;
  appointmentMakerPhone?: string;
  appointmentMakerBloodType?: string;
  isCancelled?: boolean;
};

type HospitalDto = { id: number; name: string };
type BloodTypeDto = { id: number; bloodTypeName: string };
type SelectOption = { value: string; label: string };

export const AdminDashboard = () => {
  // Sidebar
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // Page navigation
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "inventory" | "users" | "appointments"
  >("dashboard");

  const [loading, setLoading] = useState(false);

  // Data
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [hospitals, setHospitals] = useState<SelectOption[]>([]);
  const [bloodTypes, setBloodTypes] = useState<SelectOption[]>([]);

  // Inventory modals
  const [selectedInv, setSelectedInv] = useState<InventoryRow | null>(null);
  const [invEditOpen, setInvEditOpen] = useState(false);
  const [invAddOpen, setInvAddOpen] = useState(false);
  const [invUseOpen, setInvUseOpen] = useState(false);
  const [unitValue, setUnitValue] = useState(1);
  const [editHospital, setEditHospital] = useState<string | null>(null);
  const [editBloodType, setEditBloodType] = useState<string | null>(null);

  // Manage modal (grouped)
  const [manageOpen, setManageOpen] = useState(false);
  const [manageBloodTypeId, setManageBloodTypeId] = useState<number | null>(
    null
  );

  // User modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // ----------------------
  // FETCH EVERYTHING
  // ----------------------
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [hospRes, btRes] = await Promise.all([
        api.get<ApiResponse<HospitalDto[]>>("/api/hospitals"),
        api.get<ApiResponse<BloodTypeDto[]>>("/api/bloodtypes"),
      ]);

      setHospitals(
        hospRes.data.data.map((h) => ({ value: `${h.id}`, label: h.name }))
      );
      setBloodTypes(
        btRes.data.data.map((b) => ({
          value: `${b.id}`,
          label: b.bloodTypeName,
        }))
      );

      const [invRes, userRes, aptRes] = await Promise.all([
        api.get<ApiResponse<InventoryRow[]>>("/api/bloodinventorys"),
        api
          .get<ApiResponse<UserDto[]>>("/api/users")
          .catch(() => ({ data: { data: [] } })),
        api
          .get<ApiResponse<AppointmentDto[]>>("/api/appointment")
          .catch(() => ({ data: { data: [] } })),
      ]);

      setInventory(invRes.data.data);
      setUsers(userRes.data.data);
      setAppointments(aptRes.data.data);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ----------------------
  // Helpers
  // ----------------------
  const getHospitalName = (row: InventoryRow) =>
    row.hospitalName ||
    hospitals.find((h) => h.value === `${row.hospitalId}`)?.label ||
    `Hospital #${row.hospitalId}`;

  const getBloodTypeName = (row: InventoryRow) =>
    row.bloodTypeName ||
    bloodTypes.find((b) => b.value === `${row.bloodTypeId}`)?.label ||
    `Type #${row.bloodTypeId}`;

  const bloodTypeLabelById = (id: number | null) => {
    if (id == null) return "";
    return (
      bloodTypes.find((b) => Number(b.value) === id)?.label ||
      inventory.find((i) => i.bloodTypeId === id)?.bloodTypeName ||
      `Type #${id}`
    );
  };

  // ----------------------
  // Group Inventory
  // ----------------------
  const groupedByType = useMemo(() => {
    const groups: Record<
      number,
      { bloodTypeId: number; bloodTypeLabel: string; totalUnits: number }
    > = {};

    for (const row of inventory) {
      const id = row.bloodTypeId;
      if (!groups[id]) {
        groups[id] = {
          bloodTypeId: id,
          bloodTypeLabel: getBloodTypeName(row),
          totalUnits: 0,
        };
      }
      groups[id].totalUnits += row.availableUnits;
    }

    return Object.values(groups).sort((a, b) =>
      a.bloodTypeLabel.localeCompare(b.bloodTypeLabel)
    );
  }, [inventory, bloodTypes]);

  // ----------------------
  // Inventory Actions
  // ----------------------
  const handleInvEdit = async () => {
    if (!selectedInv || !editBloodType || !editHospital) return;

    try {
      await api.put(`/api/bloodinventorys/${selectedInv.id}`, {
        bloodTypeId: Number(editBloodType),
        hospitalId: Number(editHospital),
      });

      setInvEditOpen(false);
      fetchAll();
    } catch {
      alert("Error updating inventory");
    }
  };

  const handleInvUnits = async (action: "add" | "remove") => {
    if (!selectedInv) return;

    const endpoint = action === "add" ? "addunits" : "removeunits";

    await api.post(`/api/bloodinventorys/${selectedInv.id}/${endpoint}`, {
      units: unitValue,
    });

    setInvAddOpen(false);
    setInvUseOpen(false);
    fetchAll();
  };

  const handleQuickUpdate = async (
    row: InventoryRow,
    action: "add" | "remove"
  ) => {
    const endpoint = action === "add" ? "addunits" : "removeunits";

    await api.post(`/api/bloodinventorys/${row.id}/${endpoint}`, {
      units: 1,
    });

    fetchAll();
  };

  const handleInvDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    await api.delete(`/api/bloodinventorys/${id}`);
    fetchAll();
  };

  // ----------------------
  // Counts Row
  // ----------------------
  const renderCountsRow = () => (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="lg">
      <Paper p="md" withBorder>
        <Text size="xs" c="dimmed" fw={700}>
          INVENTORY RECORDS
        </Text>
        <Text fw={700} size="xl">
          {inventory.length}
        </Text>
      </Paper>

      <Paper p="md" withBorder>
        <Text size="xs" c="dimmed" fw={700}>
          USERS
        </Text>
        <Text fw={700} size="xl">
          {users.length}
        </Text>
      </Paper>

      <Paper p="md" withBorder>
        <Text size="xs" c="dimmed" fw={700}>
          APPOINTMENTS
        </Text>
        <Text fw={700} size="xl">
          {appointments.length}
        </Text>
      </Paper>

      <Paper p="md" withBorder>
        <Text size="xs" c="dimmed" fw={700}>
          HOSPITALS
        </Text>
        <Text fw={700} size="xl">
          {hospitals.length}
        </Text>
      </Paper>
    </SimpleGrid>
  );

  // ----------------------
  // Render Inventory (NO COUNTS INSIDE)
  // ----------------------
  const renderInventory = () => (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">
          Blood Inventory
        </Text>
      </Group>

      <ScrollArea h={400}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Blood Group</Table.Th>
              <Table.Th>Total Units</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {groupedByType.map((row) => (
              <Table.Tr key={row.bloodTypeId}>
                <Table.Td>
                  <Badge color="red" variant="light">
                    {row.bloodTypeLabel}
                  </Badge>
                </Table.Td>

                <Table.Td>{row.totalUnits} units</Table.Td>

                <Table.Td>
                  <Button
                    size="xs"
                    onClick={() => {
                      setManageBloodTypeId(row.bloodTypeId);
                      setManageOpen(true);
                    }}
                  >
                    Manage
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );

  // ----------------------
  // Users
  // ----------------------
  const renderUsers = () => (
    <Paper p="md" withBorder>
      <Text fw={700} size="lg" mb="md">
        Users
      </Text>

      <ScrollArea h={450}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {users.map((u) => (
              <Table.Tr key={u.id}>
                <Table.Td>
                  <Group>
                    <Avatar radius="xl">{u.firstName[0]}</Avatar>
                    <div>
                      <Text fw={500}>
                        {u.firstName} {u.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Blood: {u.bloodType}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>

                <Table.Td>
                  <Text>{u.email}</Text>
                  <Text size="xs" c="dimmed">
                    {u.phoneNumber}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Badge>{u.role || "Donor"}</Badge>
                </Table.Td>

                <Table.Td>
                  <Group gap="xs">
                    <Button
                      size="xs"
                      onClick={() => {
                        setSelectedUser(u);
                        setUserForm({
                          firstName: u.firstName,
                          lastName: u.lastName,
                          email: u.email,
                          phoneNumber: u.phoneNumber,
                        });
                        setUserModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleInvDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );

  // ----------------------
  // Appointments
  // ----------------------
  const renderAppointments = () => (
    <Paper p="md" withBorder>
      <Text fw={700} size="lg" mb="md">
        Appointments
      </Text>

      <ScrollArea h={450}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {appointments.map((apt) => (
              <Table.Tr key={apt.id}>
                <Table.Td>
                  {new Date(apt.date).toLocaleString()}
                </Table.Td>

                <Table.Td>
                  <Text fw={500}>{apt.appointmentMadeBy}</Text>
                  <Text size="xs" c="dimmed">
                    {apt.appointmentMakerEmail}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {apt.appointmentMakerPhone}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Text>{apt.appointmentType}</Text>
                  <Text size="xs" c="dimmed">
                    {apt.hospitalName}
                  </Text>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={
                      apt.status === "Approved"
                        ? "green"
                        : apt.status === "Pending"
                        ? "yellow"
                        : apt.status === "Cancelled"
                        ? "red"
                        : "blue"
                    }
                  >
                    {apt.status}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  {apt.status === "Pending" && (
                    <Group gap="xs">
                      <Button
                        size="xs"
                        color="green"
                        onClick={() =>
                          api
                            .put(`/api/appointment/${apt.id}`, {
                              ...apt,
                              status: "Approved",
                            })
                            .then(fetchAll)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        onClick={() =>
                          api
                            .put(`/api/appointment/${apt.id}`, {
                              ...apt,
                              status: "Cancelled",
                            })
                            .then(fetchAll)
                        }
                      >
                        Cancel
                      </Button>
                    </Group>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );

  // ----------------------
  // PAGE LAYOUT
  // ----------------------
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: {
          mobile: !mobileOpened,
          desktop: !desktopOpened,
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Text size="lg" fw={700}>
            Admin Panel
          </Text>

          <div style={{ marginLeft: "auto" }}>
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size="lg"
              radius="xl"
            >
              {colorScheme === "dark" ? "☀️" : "🌙"}
            </ActionIcon>
          </div>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          label="Overview"
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />
        <NavLink
          label="Blood Inventory"
          active={activeTab === "inventory"}
          onClick={() => setActiveTab("inventory")}
        />
        <NavLink
          label="Users"
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
        />
        <NavLink
          label="Appointments"
          active={activeTab === "appointments"}
          onClick={() => setActiveTab("appointments")}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          <LoadingOverlay visible={loading} />

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <Title order={2} mb="lg">
                Dashboard Overview
              </Title>

              {renderCountsRow()}

              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                {renderInventory()}
                {renderAppointments()}
              </SimpleGrid>
            </>
          )}

          {/* INVENTORY TAB */}
          {activeTab === "inventory" && (
            <>
              {renderCountsRow()}
              {renderInventory()}
            </>
          )}

          {/* USERS */}
          {activeTab === "users" && renderUsers()}

          {/* APPOINTMENTS */}
          {activeTab === "appointments" && renderAppointments()}
        </Container>
      </AppShell.Main>

      {/* ------------------------------ */}
      {/* MODALS */}
      {/* ------------------------------ */}

      {/* Edit Inventory */}
      <Modal
        opened={invEditOpen}
        onClose={() => setInvEditOpen(false)}
        title="Edit Inventory"
      >
        <Select
          label="Blood Type"
          data={bloodTypes}
          value={editBloodType}
          onChange={setEditBloodType}
          mb="md"
        />
        <Select
          label="Hospital"
          data={hospitals}
          value={editHospital}
          onChange={setEditHospital}
          mb="md"
        />
        <Button fullWidth onClick={handleInvEdit}>
          Save Changes
        </Button>
      </Modal>

      {/* Add Units */}
      <Modal
        opened={invAddOpen}
        onClose={() => setInvAddOpen(false)}
        title="Add Units"
      >
        <NumberInput
          label="Units to Add"
          value={unitValue}
          onChange={(v) => setUnitValue(Number(v))}
          min={1}
        />
        <Button
          fullWidth
          mt="md"
          color="green"
          onClick={() => handleInvUnits("add")}
        >
          Add Units
        </Button>
      </Modal>

      {/* Remove Units */}
      <Modal
        opened={invUseOpen}
        onClose={() => setInvUseOpen(false)}
        title="Use Units"
      >
        <NumberInput
          label="Units to Remove"
          value={unitValue}
          onChange={(v) => setUnitValue(Number(v))}
          min={1}
        />
        <Button
          fullWidth
          mt="md"
          color="yellow"
          onClick={() => handleInvUnits("remove")}
        >
          Confirm Usage
        </Button>
      </Modal>

      {/* Manage Blood Type */}
      <Modal
        opened={manageOpen}
        onClose={() => setManageOpen(false)}
        title={`Manage: ${bloodTypeLabelById(manageBloodTypeId)}`}
        size="lg"
      >
        {inventory
          .filter((i) => i.bloodTypeId === manageBloodTypeId)
          .map((inv) => (
            <Paper key={inv.id} withBorder p="sm" mb="sm">
              <Group justify="space-between">
                <div>
                  <Text fw={600}>{getHospitalName(inv)}</Text>
                  <Text size="sm" c="dimmed">
                    {inv.availableUnits} units
                  </Text>
                </div>

                <Group gap="xs">
                  <Button
                    size="xs"
                    color="green"
                    onClick={() => handleQuickUpdate(inv, "add")}
                  >
                    +
                  </Button>

                  <Button
                    size="xs"
                    color="yellow"
                    onClick={() => handleQuickUpdate(inv, "remove")}
                  >
                    -
                  </Button>

                  <Button
                    size="xs"
                    onClick={() => {
                      setSelectedInv(inv);
                      setEditBloodType(String(inv.bloodTypeId));
                      setEditHospital(String(inv.hospitalId));
                      setInvEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleInvDelete(inv.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>
            </Paper>
          ))}

        {inventory.filter((i) => i.bloodTypeId === manageBloodTypeId).length ===
          0 && <Text c="dimmed">No hospitals found for this blood type.</Text>}
      </Modal>

      {/* Edit User */}
      <Modal
        opened={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Edit User"
      >
        <TextInput
          label="First Name"
          value={userForm.firstName}
          onChange={(e) =>
            setUserForm({ ...userForm, firstName: e.target.value })
          }
          mb="sm"
        />
        <TextInput
          label="Last Name"
          value={userForm.lastName}
          onChange={(e) =>
            setUserForm({ ...userForm, lastName: e.target.value })
          }
          mb="sm"
        />
        <TextInput
          label="Email"
          value={userForm.email}
          onChange={(e) =>
            setUserForm({ ...userForm, email: e.target.value })
          }
          mb="sm"
        />
        <TextInput
          label="Phone"
          value={userForm.phoneNumber}
          onChange={(e) =>
            setUserForm({ ...userForm, phoneNumber: e.target.value })
          }
          mb="sm"
        />

        <Button fullWidth onClick={() => setUserModalOpen(false)}>
          Save User
        </Button>
      </Modal>
    </AppShell>
  );
};
