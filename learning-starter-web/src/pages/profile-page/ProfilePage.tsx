import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Text,
  Title,
  Button,
  Modal,
  TextInput,
  Select,
  Grid,
  Group,
  Avatar,
  Stack,
  FileButton,
  Divider,
  Badge,
} from "@mantine/core";
import api from "../../config/axios";
import { useAuth } from "../../authentication/use-auth";
import { ApiResponse, UserDto } from "../../constants/types";

// ------------------------------------------------------------
// DTOs
// ------------------------------------------------------------
type HospitalDto = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
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
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const ProfilePage = () => {
  const { user, refetchUser } = useAuth();

  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [hospitals, setHospitals] = useState<HospitalDto[]>([]);

  // Profile Picture State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // Appointment Edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [current, setCurrent] = useState<AppointmentDto | null>(null);
  const [editData, setEditData] = useState({
    date: "",
    info: "",
    hospitalId: 0,
  });

  // Profile Edit
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<UserDto | null>(null);

  // ------------------------------------------------------------
  // Init & Effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (user) {
      loadHospitals();
      loadAppointments();
    }
  }, [user]);

  // Handle local image preview when file is selected
  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarUrl(objectUrl);
      
      // Cleanup memory to avoid leaks
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  // ------------------------------------------------------------
  // Loaders
  // ------------------------------------------------------------
  const loadHospitals = async () => {
    try {
      const res = await api.get<ApiResponse<HospitalDto[]>>("/api/hospitals");
      setHospitals(res.data.data);
    } catch (e) {
      console.error("Error loading hospitals", e);
    }
  };

  const loadAppointments = async () => {
    if (!user) return;
    try {
      const res = await api.get<ApiResponse<AppointmentDto[]>>("/api/appointment");
      const mine = res.data.data.filter(
        (appt) => Number(appt.userId) === Number(user.id)
      );
      setAppointments(mine);
    } catch (e) {
      console.error("Error loading appointments", e);
    }
  };

  // ------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------
  const deleteAppointment = async (id: number) => {
    if(!window.confirm("Are you sure?")) return;
    await api.delete(`/api/appointment/${id}`);
    loadAppointments();
  };

  const startEdit = (appt: AppointmentDto) => {
    setCurrent(appt);
    setEditData({
      date: appt.date.substring(0, 16),
      info: appt.info,
      hospitalId: appt.hospitalId,
    });
    setEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!current || !user) return;
    await api.put(`/api/appointment/${current.id}`, {
      userId: user.id,
      hospitalId: editData.hospitalId,
      appointmentType: current.appointmentType,
      status: current.status,
      date: editData.date,
      info: editData.info,
    });
    setEditModalOpen(false);
    loadAppointments();
  };

  const openProfileEdit = () => {
    if (user) {
      setProfileData({ ...user });
      setProfileModalOpen(true);
    }
  };

  const saveProfile = async () => {
    if (!profileData) return;

    // TODO: Add image upload logic here if backend supports it
    await api.put(`/api/users/${profileData.id}`, profileData);
    setProfileModalOpen(false);
    refetchUser();
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <>
      <Container size="lg" mt="xl" pb="xl">
        
        {/* === HEADER / PROFILE SECTION === */}
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Grid>
            {/* LEFT: AVATAR & ACTION */}
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <Stack align="center" gap="sm">
                <Avatar 
                  src={avatarUrl} 
                  alt="Profile" 
                  size={150} 
                  radius={150} 
                  color="blue"
                  // styles prop is deprecated in some v7 versions, using style directly or vars is safer
                  style={{ border: '4px solid #f1f3f5' }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                
                <FileButton onChange={setAvatarFile} accept="image/png,image/jpeg">
                  {(props) => (
                    <Button {...props} variant="light" size="xs">
                      Change Photo
                    </Button>
                  )}
                </FileButton>
              </Stack>
            </Grid.Col>

            {/* RIGHT: DETAILS */}
            <Grid.Col span={{ base: 12, sm: 8, md: 9 }}>
              <Group justify="space-between" mb="md">
                <div>
                  <Title order={2}>{user?.firstName} {user?.lastName}</Title>
                  <Text c="dimmed" size="sm">Patient ID: {user?.id}</Text>
                </div>
                <Button variant="outline" onClick={openProfileEdit}>
                  Edit Profile
                </Button>
              </Group>

              <Divider my="sm" />

              <Grid mt="md">
                <Grid.Col span={6}>
                  <Text fw={500} c="dimmed" size="xs" tt="uppercase">Email</Text>
                  <Text>{user?.email}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500} c="dimmed" size="xs" tt="uppercase">Phone</Text>
                  <Text>{user?.phoneNumber || "N/A"}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500} c="dimmed" size="xs" tt="uppercase">Gender</Text>
                  <Text>{user?.gender || "N/A"}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500} c="dimmed" size="xs" tt="uppercase">Blood Type</Text>
                  <Badge color="red" variant="light" size="lg">{user?.bloodType || "?"}</Badge>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Text fw={500} c="dimmed" size="xs" tt="uppercase">Address</Text>
                  <Text>{user?.address || "N/A"}</Text>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Card>

        {/* === APPOINTMENTS SECTION === */}
        <Title order={3} mt={40} mb="md">
          My Appointments
        </Title>

        <Grid>
          {appointments.map((appt) => (
            <Grid.Col span={{ base: 12, md: 6 }} key={appt.id}>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={700} size="lg">{appt.appointmentType}</Text>
                  <Badge 
                    color={appt.status === 'Completed' ? 'green' : appt.status === 'Pending' ? 'yellow' : 'blue'}
                  >
                    {appt.status}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mb="md">
                  {new Date(appt.date).toLocaleString("en-US", {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Text>

                <Divider my="sm" />

                <Text size="sm"><b>Hospital:</b> {appt.hospitalName}</Text>
                <Text size="sm" mt={4}><b>Notes:</b> {appt.info}</Text>

                <Group mt="lg">
                  <Button variant="light" size="xs" onClick={() => startEdit(appt)}>
                    Edit Details
                  </Button>
                  <Button variant="subtle" color="red" size="xs" onClick={() => deleteAppointment(appt.id)}>
                    Delete
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          ))}

          {appointments.length === 0 && (
            <Container>
               <Text c="dimmed" ta="center" mt="xl">
                 You have no upcoming appointments.
               </Text>
            </Container>
          )}
        </Grid>
      </Container>

      {/* EDIT APPOINTMENT MODAL */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Appointment"
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Hospital"
            data={hospitals.map((h) => ({
              value: h.id.toString(),
              label: `${h.name} – ${h.address}`,
            }))}
            value={editData.hospitalId.toString()}
            onChange={(value) =>
              setEditData((prev) => ({ ...prev, hospitalId: Number(value) }))
            }
          />
          <TextInput label="Status" disabled value={current?.status} />
          <TextInput
            label="Date & Time"
            type="datetime-local"
            value={editData.date}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <TextInput
            label="Notes / Symptoms"
            value={editData.info}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, info: e.target.value }))
            }
          />
          <Button fullWidth mt="md" onClick={saveEdit}>
            Save Changes
          </Button>
        </Stack>
      </Modal>

      {/* EDIT PROFILE MODAL */}
      <Modal
        opened={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Edit My Profile"
        size="lg"
      >
        {profileData && (
          <Grid>
             <Grid.Col span={6}>
              <TextInput
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              />
            </Grid.Col>
            
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                label="Gender"
                data={["Male", "Female", "Other"]}
                value={profileData.gender}
                onChange={(value) => setProfileData({ ...profileData, gender: value || "" })}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                label="Blood Type"
                data={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                value={profileData.bloodType}
                onChange={(value) => setProfileData({ ...profileData, bloodType: value || "" })}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Button fullWidth mt="md" onClick={saveProfile}>
                Save Profile
              </Button>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </>
  );
};