"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  ConfigProvider,
  Grid,
  Input,
  Menu,
  Spin,
  Tag,
  theme,
  type MenuProps,
} from "antd";
import {
  ApiOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  HistoryOutlined,
  KeyOutlined,
  LinkOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getFirebaseAuth, getFirebasePublicConfig } from "@/lib/firebase/client";
import { AdminsView } from "./views/admins-view";
import { ContentView } from "./views/content-view";
import { DevicesView } from "./views/devices-view";
import { LinksView } from "./views/links-view";
import { LoginsView } from "./views/logins-view";
import { OverviewView } from "./views/overview-view";
import { UsersView } from "./views/users-view";

type AdminView =
  | "overview"
  | "users"
  | "devices"
  | "logins"
  | "links"
  | "content"
  | "admins"
  | "settings";
type AuthStatus = "checking" | "ready";

const menuItems: MenuProps["items"] = [
  {
    key: "overview",
    icon: <DashboardOutlined />,
    label: "Tổng quan",
  },
  {
    key: "users",
    icon: <TeamOutlined />,
    label: "Người dùng",
  },
  {
    key: "devices",
    icon: <MobileOutlined />,
    label: "Thiết bị",
  },
  {
    key: "logins",
    icon: <HistoryOutlined />,
    label: "Lịch sử đăng nhập",
  },
  {
    key: "links",
    icon: <LinkOutlined />,
    label: "Link chia sẻ",
  },
  {
    key: "content",
    icon: <AppstoreOutlined />,
    label: "Nội dung app",
  },
  {
    key: "admins",
    icon: <SafetyCertificateOutlined />,
    label: "Quản trị viên",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Cấu hình",
  },
];

const viewLabels: Record<AdminView, string> = {
  overview: "Tổng quan",
  users: "Người dùng",
  devices: "Thiết bị",
  logins: "Lịch sử đăng nhập",
  links: "Link chia sẻ",
  content: "Nội dung app",
  admins: "Quản trị viên",
  settings: "Cấu hình",
};

const authErrorMessages: Record<string, string> = {
  "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/user-disabled": "Tài khoản này đã bị vô hiệu hoá.",
  "auth/too-many-requests":
    "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.",
  "auth/network-request-failed": "Lỗi kết nối mạng. Vui lòng thử lại.",
};

function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  return authErrorMessages[code] ?? "Không thể đăng nhập. Vui lòng thử lại.";
}

function LoginScreen() {
  const config = getFirebasePublicConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();

    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase chưa được cấu hình cho trang admin.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (signInError) {
      setError(getAuthErrorMessage(signInError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-brand" aria-label="MK Tech admin">
        <div className="admin-login-brand__content">
          <Tag color="green">MK Tech Vietnam</Tag>
          <h1>Mobile App Admin</h1>
          <p>Quản lý người dùng, thiết bị, nội dung và cấu hình vận hành app.</p>
          <div className="admin-login-api">
            <CloudServerOutlined />
            <span>{config.projectId}</span>
          </div>
        </div>
      </section>

      <section className="admin-login-panel" aria-label="Admin login">
        <Card className="admin-login-card">
          <div className="admin-login-card__header">
            <Avatar size={48} icon={<SafetyCertificateOutlined />} />
            <div>
              <h2>Đăng nhập quản trị</h2>
              <p>Firebase Auth</p>
            </div>
          </div>

          {!config.isConfigured ? (
            <Alert
              showIcon
              type="warning"
              message="Chưa đủ cấu hình Firebase"
              description="Cần cấu hình biến môi trường NEXT_PUBLIC_FIREBASE_* trước khi đăng nhập."
            />
          ) : null}

          {error ? (
            <Alert showIcon type="error" message="Đăng nhập thất bại" description={error} />
          ) : null}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label htmlFor="admin-email">Email</label>
            <Input
              id="admin-email"
              size="large"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              prefix={<MailOutlined />}
              placeholder="admin@mktechvn.com"
              autoComplete="username"
              required
            />

            <label htmlFor="admin-password">Mật khẩu</label>
            <Input
              id="admin-password"
              size="large"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              prefix={<KeyOutlined />}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              loading={loading}
              disabled={!config.isConfigured}
            >
              Đăng nhập
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}

function AccessDenied({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <main className="admin-access-denied">
      <Card className="admin-access-denied__card">
        <Alert
          showIcon
          type="error"
          message="Tài khoản chưa được cấp quyền admin"
          description="Tài khoản này chưa có quyền admin. Hãy liên hệ quản trị viên hiện tại để được cấp quyền."
        />
        <Button icon={<LogoutOutlined />} onClick={onSignOut}>
          Đăng xuất
        </Button>
      </Card>
    </main>
  );
}

function SettingsPanel() {
  const config = getFirebasePublicConfig();

  return (
    <div className="admin-view">
      <div className="admin-settings-grid">
        <Card title="Firebase">
          <div className="admin-setting-list">
            <div>
              <span>Project ID</span>
              <strong>{config.projectId}</strong>
            </div>
            <div>
              <span>Auth domain</span>
              <strong>{config.authDomain}</strong>
            </div>
            <div>
              <span>Web API key</span>
              {config.apiKey ? (
                <Tag color="green">Đã cấu hình</Tag>
              ) : (
                <Tag color="red">Thiếu</Tag>
              )}
            </div>
            <div>
              <span>Phân quyền admin</span>
              <strong>Custom claim admin (Firebase Auth)</strong>
            </div>
          </div>
        </Card>

        <Card title="Security checklist">
          <div className="admin-checklist">
            <Badge status="success" text="Firebase Auth email/password" />
            <Badge status="success" text="Firestore Security Rules cho từng collection mobile app" />
            <Badge status="success" text="Admin role qua custom claim, kiểm tra cả ở server" />
            <Badge status="success" text="Lịch sử đăng nhập tự xoá sau 180 ngày (Firestore TTL)" />
            <Badge status="default" text="Audit log cho thao tác quản trị" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard({
  user,
  onSignOut,
}: {
  user: User;
  onSignOut: () => Promise<void>;
}) {
  const screens = Grid.useBreakpoint();
  const [view, setView] = useState<AdminView>("overview");
  const currentLabel = viewLabels[view];

  function renderView() {
    switch (view) {
      case "users":
        return <UsersView />;
      case "devices":
        return <DevicesView />;
      case "logins":
        return <LoginsView />;
      case "links":
        return <LinksView />;
      case "content":
        return <ContentView />;
      case "admins":
        return <AdminsView currentEmail={user.email} />;
      case "settings":
        return <SettingsPanel />;
      case "overview":
      default:
        return <OverviewView user={user} />;
    }
  }

  return (
    <main className="admin-console">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Avatar icon={<ApiOutlined />} />
          <div>
            <strong>MK Admin</strong>
            <span>Mobile app control</span>
          </div>
        </div>

        <Menu
          className="admin-menu"
          mode={screens.lg ? "inline" : "horizontal"}
          selectedKeys={[view]}
          items={menuItems}
          onClick={({ key }) => setView(key as AdminView)}
        />
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-kicker">Admin console</span>
            <h1>{currentLabel}</h1>
          </div>
          <div className="admin-user">
            <Avatar icon={<UserOutlined />} />
            <div>
              <strong>{user.email}</strong>
              <span>Admin</span>
            </div>
            <Button icon={<LogoutOutlined />} onClick={onSignOut}>
              Đăng xuất
            </Button>
          </div>
        </header>

        {renderView()}
      </section>
    </main>
  );
}

function AdminLoading() {
  return (
    <main className="admin-loading">
      <Spin size="large" />
    </main>
  );
}

export function AdminConsole() {
  const config = getFirebasePublicConfig();
  const [status, setStatus] = useState<AuthStatus>(
    config.isConfigured ? "checking" : "ready",
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return;
    }

    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setStatus("ready");
        }
        return;
      }

      // Force a token refresh so a claim granted after the last sign-in is
      // picked up without asking the user to log out and back in.
      const tokenResult = await nextUser.getIdTokenResult(true).catch(() => null);
      if (!mounted) {
        return;
      }

      setUser(nextUser);
      setIsAdmin(tokenResult?.claims.admin === true);
      setStatus("ready");
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setIsAdmin(false);
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorPrimary: "#1677ff",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
        components: {
          Card: {
            headerBg: "#ffffff",
          },
          Menu: {
            itemBorderRadius: 8,
          },
        },
      }}
    >
      {status === "checking" ? <AdminLoading /> : null}
      {status === "ready" && !user ? <LoginScreen /> : null}
      {status === "ready" && user && !isAdmin ? (
        <AccessDenied onSignOut={handleSignOut} />
      ) : null}
      {status === "ready" && user && isAdmin ? (
        <AdminDashboard user={user} onSignOut={handleSignOut} />
      ) : null}
    </ConfigProvider>
  );
}
