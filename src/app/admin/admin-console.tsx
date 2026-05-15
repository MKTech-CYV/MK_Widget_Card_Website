"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  ConfigProvider,
  Empty,
  Grid,
  Input,
  Menu,
  Spin,
  Statistic,
  Table,
  Tag,
  theme,
  type MenuProps,
  type TableColumnsType,
} from "antd";
import {
  ApiOutlined,
  AppstoreOutlined,
  BellOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  KeyOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getSupabaseBrowserClient,
  getSupabasePublicConfig,
} from "@/lib/supabase/client";

type AdminView = "overview" | "users" | "devices" | "content" | "settings";
type AuthStatus = "checking" | "ready";

type ModuleRow = {
  key: string;
  module: string;
  scope: string;
  status: "ready" | "pending";
  owner: string;
};

const moduleRows: ModuleRow[] = [
  {
    key: "users",
    module: "Users",
    scope: "Hồ sơ, phân quyền, trạng thái tài khoản",
    status: "ready",
    owner: "Supabase Auth",
  },
  {
    key: "devices",
    module: "Devices",
    scope: "Thiết bị, phiên đăng nhập, platform iOS/Android",
    status: "pending",
    owner: "App database",
  },
  {
    key: "content",
    module: "App content",
    scope: "Banner, thông báo, cấu hình mobile app",
    status: "pending",
    owner: "CMS tables",
  },
  {
    key: "push",
    module: "Push campaigns",
    scope: "Chiến dịch notification và lịch gửi",
    status: "pending",
    owner: "Messaging",
  },
];

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
    key: "content",
    icon: <AppstoreOutlined />,
    label: "Nội dung app",
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
  content: "Nội dung app",
  settings: "Cấu hình",
};

function isAdminAllowed(session: Session | null, adminEmails: string[]) {
  if (!session) {
    return false;
  }

  if (adminEmails.length === 0) {
    return true;
  }

  return adminEmails.includes(session.user.email?.toLowerCase() ?? "");
}

function formatDate(value?: string) {
  if (!value) {
    return "Chưa có";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function LoginScreen() {
  const config = getSupabasePublicConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError(
        "Thiếu Supabase public key. Hãy cấu hình NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
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
            <span>{config.restUrl}</span>
          </div>
        </div>
      </section>

      <section className="admin-login-panel" aria-label="Admin login">
        <Card className="admin-login-card">
          <div className="admin-login-card__header">
            <Avatar size={48} icon={<SafetyCertificateOutlined />} />
            <div>
              <h2>Đăng nhập quản trị</h2>
              <p>Supabase Auth</p>
            </div>
          </div>

          {!config.isConfigured ? (
            <Alert
              showIcon
              type="warning"
              message="Chưa đủ cấu hình Supabase"
              description="Cần thêm public key vào biến môi trường trước khi đăng nhập."
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
          description="Email đã đăng nhập không nằm trong NEXT_PUBLIC_ADMIN_EMAILS."
        />
        <Button icon={<LogoutOutlined />} onClick={onSignOut}>
          Đăng xuất
        </Button>
      </Card>
    </main>
  );
}

function OverviewPanel({ session }: { session: Session }) {
  const columns: TableColumnsType<ModuleRow> = [
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: "Phạm vi",
      dataIndex: "scope",
      key: "scope",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: ModuleRow["status"]) =>
        value === "ready" ? <Tag color="green">Sẵn sàng</Tag> : <Tag>Chờ schema</Tag>,
    },
    {
      title: "Nguồn",
      dataIndex: "owner",
      key: "owner",
      responsive: ["md"],
    },
  ];

  return (
    <div className="admin-view">
      <div className="admin-stats-grid">
        <Card>
          <Statistic
            title="Auth session"
            value="Active"
            prefix={<SafetyCertificateOutlined />}
          />
        </Card>
        <Card>
          <Statistic title="Current user" value={session.user.email ?? "User"} />
        </Card>
        <Card>
          <Statistic title="Last sign-in" value={formatDate(session.user.last_sign_in_at)} />
        </Card>
        <Card>
          <Statistic title="Platforms" value="iOS / Android" prefix={<MobileOutlined />} />
        </Card>
      </div>

      <Card title="Mobile app modules">
        <Table
          columns={columns}
          dataSource={moduleRows}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Card>
    </div>
  );
}

function EmptySection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="admin-empty-copy">
            <span className="admin-empty-icon">{icon}</span>
            <strong>{title}</strong>
            <span>{description}</span>
          </span>
        }
      />
    </Card>
  );
}

function SettingsPanel() {
  const config = getSupabasePublicConfig();

  return (
    <div className="admin-view">
      <div className="admin-settings-grid">
        <Card title="Supabase">
          <div className="admin-setting-list">
            <div>
              <span>Project URL</span>
              <strong>{config.projectUrl}</strong>
            </div>
            <div>
              <span>REST API</span>
              <strong>{config.restUrl}</strong>
            </div>
            <div>
              <span>Public key</span>
              {config.publishableKey ? (
                <Tag color="green">Đã cấu hình</Tag>
              ) : (
                <Tag color="red">Thiếu</Tag>
              )}
            </div>
            <div>
              <span>Admin emails</span>
              <strong>
                {config.adminEmails.length > 0
                  ? `${config.adminEmails.length} email`
                  : "Cho phép mọi user đã đăng nhập"}
              </strong>
            </div>
          </div>
        </Card>

        <Card title="Security checklist">
          <div className="admin-checklist">
            <Badge status="success" text="Supabase Auth email/password" />
            <Badge status="processing" text="RLS policies cho từng bảng mobile app" />
            <Badge status="processing" text="Admin role claim hoặc bảng admin_users" />
            <Badge status="default" text="Audit log cho thao tác quản trị" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard({
  session,
  onSignOut,
}: {
  session: Session;
  onSignOut: () => Promise<void>;
}) {
  const screens = Grid.useBreakpoint();
  const [view, setView] = useState<AdminView>("overview");
  const currentLabel = viewLabels[view];

  function renderView() {
    switch (view) {
      case "users":
        return (
          <EmptySection
            icon={<TeamOutlined />}
            title="User management"
            description="Sẵn sàng nối bảng profiles hoặc auth user mirror."
          />
        );
      case "devices":
        return (
          <EmptySection
            icon={<MobileOutlined />}
            title="Device registry"
            description="Sẵn sàng nối bảng devices, app_version và platform."
          />
        );
      case "content":
        return (
          <EmptySection
            icon={<BellOutlined />}
            title="App content"
            description="Sẵn sàng nối banner, notification và remote config."
          />
        );
      case "settings":
        return <SettingsPanel />;
      case "overview":
      default:
        return <OverviewPanel session={session} />;
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
              <strong>{session.user.email}</strong>
              <span>{session.user.role}</span>
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
  const config = getSupabasePublicConfig();
  const [status, setStatus] = useState<AuthStatus>(
    config.isConfigured ? "checking" : "ready",
  );
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setSession(data.session);
      setStatus("ready");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus("ready");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setSession(null);
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
      {status === "ready" && !session ? <LoginScreen /> : null}
      {status === "ready" && session && !isAdminAllowed(session, config.adminEmails) ? (
        <AccessDenied onSignOut={handleSignOut} />
      ) : null}
      {status === "ready" && session && isAdminAllowed(session, config.adminEmails) ? (
        <AdminDashboard session={session} onSignOut={handleSignOut} />
      ) : null}
    </ConfigProvider>
  );
}
