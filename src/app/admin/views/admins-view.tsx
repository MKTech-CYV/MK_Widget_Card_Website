"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Input, Popconfirm, Table, message, type TableColumnsType } from "antd";
import { MailOutlined, ReloadOutlined, UserAddOutlined } from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { adminFetch } from "./api";
import { formatDateTime, getErrorMessage, toDate } from "./format";
import { useLoad } from "./use-load";

type AdminRow = {
  key: string;
  email: string;
  grantedBy: string;
  createdAt: unknown;
};

async function loadAdmins() {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase chưa được cấu hình.");
  }

  const snap = await getDocs(collection(db, "admin_users"));
  return snap.docs
    .map<AdminRow>((doc) => ({
      key: doc.id,
      email: (doc.get("email") as string) || "—",
      grantedBy: (doc.get("granted_by") as string) || "—",
      createdAt: doc.get("created_at"),
    }))
    .sort(
      (a, b) =>
        (toDate(a.createdAt)?.getTime() ?? 0) - (toDate(b.createdAt)?.getTime() ?? 0),
    );
}

export function AdminsView({ currentEmail }: { currentEmail: string | null }) {
  const { data, error, loading, reload } = useLoad("admins", loadAdmins);
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function setAdmin(targetEmail: string, admin: boolean) {
    setSaving(true);
    try {
      await adminFetch("/api/admin/claims", {
        method: "POST",
        body: { email: targetEmail, admin },
      });
      messageApi.success(admin ? "Đã cấp quyền admin." : "Đã thu hồi quyền admin.");
      setEmail("");
      reload();
    } catch (requestError) {
      messageApi.error(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  function handleGrant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) {
      void setAdmin(email.trim(), true);
    }
  }

  const columns: TableColumnsType<AdminRow> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value: string) => (value === currentEmail ? `${value} (bạn)` : value),
    },
    { title: "Cấp bởi", dataIndex: "grantedBy", key: "grantedBy" },
    {
      title: "Ngày cấp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: unknown) => formatDateTime(value),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_value, row) => (
        <Popconfirm
          title="Thu hồi quyền admin?"
          description={`${row.email} sẽ không vào được trang admin nữa.`}
          okText="Thu hồi"
          cancelText="Huỷ"
          okButtonProps={{ danger: true }}
          onConfirm={() => setAdmin(row.email, false)}
        >
          <Button danger size="small" disabled={saving}>
            Thu hồi
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="admin-view">
      {contextHolder}
      {error ? <Alert showIcon type="error" message="Không tải được danh sách admin" description={error} /> : null}

      <Card title="Cấp quyền admin">
        <p style={{ marginTop: 0 }}>
          Người được cấp cần đã có tài khoản Firebase (đã đăng nhập app hoặc được tạo sẵn). Quyền có hiệu lực ngay ở lần đăng nhập tiếp theo.
        </p>
        <form onSubmit={handleGrant} style={{ display: "flex", gap: 8, maxWidth: 520 }}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            prefix={<MailOutlined />}
            placeholder="email@example.com"
            required
          />
          <Button type="primary" htmlType="submit" icon={<UserAddOutlined />} loading={saving}>
            Cấp quyền
          </Button>
        </form>
      </Card>

      <Card
        title={`Quản trị viên (${data?.length ?? 0})`}
        extra={<Button icon={<ReloadOutlined />} onClick={reload} loading={loading} />}
      >
        <Table columns={columns} dataSource={data ?? []} loading={loading} pagination={false} scroll={{ x: 600 }} />
      </Card>
    </div>
  );
}
