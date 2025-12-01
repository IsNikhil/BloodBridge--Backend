import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Container, Group, Button, Flex, Image, Avatar, Menu } from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import logo from "../../assets/logo.png";
import { useAuth } from "../../authentication/use-auth";
import { UserDto } from "../../constants/types";
import { routes } from "../../routes";
import { NAVBAR_HEIGHT } from "../../constants/theme-constants";
import { useMantineColorScheme } from "@mantine/core";


type PrimaryNavigationProps = { user?: UserDto };

const navLinks = [
  { label: "Home", path: routes.home },
  { label: "Donate Blood", path: routes.donationPage },
  { label: "Request Blood", path: routes.receive ?? "/request" },
  { label: "Contact Us", path: routes.contact },
 
];

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({ user }) => {
  const { classes, cx } = useStyles();
  const { pathname } = useLocation();
  const [active, setActive] = useState(pathname);
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
const dark = colorScheme === "dark";

  useEffect(() => setActive(pathname), [pathname]);

  return (
    <Container fluid className={classes.navContainer}>
      <Flex justify="space-between" align="center" className={classes.inner}>
        {/* Left: Logo + Links */}
        <Flex align="center">
          <NavLink to={routes.root}>
            <Image src={logo} alt="logo" w={100} h={100} radius="sm" className={classes.logo} />
          </NavLink>

          <Group ml="md">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={NavLink}
                to={link.path}
                variant={active === link.path ? "filled" : "subtle"}
                color="gray"
                className={cx(classes.navButton, {
                  [classes.active]: active === link.path,
                })}
              >
                {link.label}
              </Button>
            ))}
          </Group>
        </Flex>

        {/* Right: Avatar Menu */}
        {user && (
          <Menu>
            <Menu.Target>
              <Avatar className={classes.pointer}>
                {user.firstName[0]}
                {user.lastName[0]}
              </Avatar>
            </Menu.Target>
           <Menu.Dropdown>
  <Menu.Item component={NavLink} to={routes.profile}>
    My Profile
  </Menu.Item>

  <Menu.Item onClick={() => toggleColorScheme()}>
    {dark ? "Light mode" : " Dark mode"}
  </Menu.Item>

  <Menu.Item color="red" onClick={() => logout()}>
     Sign Out
  </Menu.Item>
</Menu.Dropdown>

          </Menu>
        )}
      </Flex>
    </Container>
  );
};

const useStyles = createStyles((theme) => ({
  navContainer: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor: "var(--mantine-color-body)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
  inner: {
    height: NAVBAR_HEIGHT,
    padding: "0 1.5rem",
  },
  logo: {
    cursor: "pointer",
  },
  navButton: {
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  active: {
    backgroundColor: theme.colors.red[7],
    color: "#fff !important",
  },
  pointer: {
    cursor: "pointer",
  },
}));
