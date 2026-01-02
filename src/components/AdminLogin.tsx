import { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  Container,
} from "@mui/material";
import PasswordField from "./PasswordField";
import { isAdmin, hasAnyAdminSecrets, addAdminSecret } from "../services/db";

interface Props {
  onLogin: () => void;
  page?: boolean;
}

export default function AdminLogin({ onLogin, page = false }: Props) {
  const [secrete, setSecrete] = useState("");
  const [notice, setNotice] = useState<string>("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "">("");
  const [showSetup, setShowSetup] = useState(false);
  const [setupPassword, setSetupPassword] = useState("");

  // Check if admin collection has any documents
  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        const hasAdmins = await hasAnyAdminSecrets();
        if (!hasAdmins) {
          setShowSetup(true);
        }
      } catch (error) {
        console.error("Error checking admin setup:", error);
        setShowSetup(true);
      }
    };
    checkAdminSetup();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const valid = await isAdmin(secrete);
      if (!valid) {
        setNotice("Invalid admin secrete");
        setNoticeType("error");
        return;
      }
      setNotice("");
      try {
        localStorage.setItem("assignly_admin_authed", "1");
      } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("assignly:admin-auth", { detail: { authed: true } })
        );
      } catch {}
      onLogin();
    } catch (error) {
      setNotice("Error checking admin secrete");
      setNoticeType("error");
    }
  };

  const handleSetupAdmin = async () => {
    if (!setupPassword.trim()) {
      setNotice("Please enter an admin password");
      setNoticeType("error");
      return;
    }
    if (setupPassword.length < 4) {
      setNotice("Admin password must be at least 4 characters long");
      setNoticeType("error");
      return;
    }
    try {
      const success = await addAdminSecret(setupPassword.trim());
      if (success) {
        setNotice(
          `Admin password has been set up successfully! Use "${setupPassword.trim()}" to login.`
        );
        setNoticeType("success");
        setShowSetup(false);
        setSetupPassword("");
      } else {
        setNotice("Failed to set up admin password. Check console for errors.");
        setNoticeType("error");
      }
    } catch (error) {
      setNotice("Error setting up admin password.");
      setNoticeType("error");
    }
  };

  const loginForm = showSetup ? (
    <Card sx={{ maxWidth: 400, mx: "auto" }}>
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <Typography component="span" fontWeight="bold">
              Admin Setup Required:
            </Typography>{" "}
            No admin password found. Please create your admin password below.
          </Typography>
        </Alert>
        <PasswordField
          label="Create admin password"
          value={setupPassword}
          onChange={setSetupPassword}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSetupAdmin}
          size="large"
          sx={{ mt: 2 }}
        >
          Set Up Admin Password
        </Button>
        {notice && (
          <Alert
            severity={noticeType === "success" ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {notice}
          </Alert>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card sx={{ maxWidth: 400, mx: "auto" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 600 }}
        >
          Admin Access
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Sign in with your Secrete
        </Typography>
        <PasswordField
          label="Admin Password"
          value={secrete}
          onChange={setSecrete}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleAuth}
          size="large"
          sx={{ mt: 2 }}
        >
          Continue
        </Button>
        {notice && (
          <Alert
            severity={noticeType === "success" ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {notice}
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return page ? (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {loginForm}
    </Container>
  ) : (
    loginForm
  );
}
