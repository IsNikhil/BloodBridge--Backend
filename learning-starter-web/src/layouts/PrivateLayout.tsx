import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { useAuth } from "../authentication/use-auth";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return <PageWrapper user={user ?? undefined}>{children}</PageWrapper>;
};
