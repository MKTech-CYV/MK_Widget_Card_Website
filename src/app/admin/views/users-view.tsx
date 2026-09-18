"use client";

import { useState } from "react";
import { Alert, Button, Card, Input, Table, type TableColumnsType } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { formatDateTime, toDate } from "./format";
import { useLoad } from "./use-load";

type UserRow = {
  key: string;
  email: string;
  createdAt: unknown;
  ecards: number;
  banks: number;
  devices: number;
  lastSeen: unknown;
};

async function loadUsers() {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase chưa được cấu hình.");
  }

  const [profiles, devices] = await Promise.all([
    getDocs(query(collection(db, "profiles"), limit(300))),
    getDocs(
      query(collection(db, "devices"), orderBy("last_seen_at", "desc"), limit(1000)),
    ),
  ]);

  // Devices are ordered newest first, so the first one seen per uid is the
  // most recent.
  const byUid = new Map<string, { count: number; lastSeen: unknown }>();
  devices.docs.forEach((doc) => {
    const uid = doc.get("uid") as string;
    const entry = byUid.get(uid);
    if (entry) {
      entry.count += 1;
    } else {
      byUid.set(uid, { count: 1, lastSeen: doc.get("last_seen_at") });
    }
  });

  const rows: UserRow[] = profiles.docs.map((doc) => ({
    key: doc.id,
    email: (doc.get("email") as string) || "—",
    createdAt: doc.get("created_at"),
    ecards: (doc.get("ecard_preset_count") as number) ?? 0,
    banks: (doc.get("bank_qr_preset_count") as number) ?? 0,
    devices: byUid.get(doc.id)?.count ?? 0,
    lastSeen: byUid.get(doc.id)?.lastSeen,
  }));

  rows.sort(
    (a, b) =>
      (toDate(b.createdAt)?.getTime() ?? 0) - (toDate(a.createdAt)?.getTime() ?? 0),
  );

  return rows;
}

const columns: TableColumnsType<UserRow> = [
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: unknown) => formatDateTime(value),
  },
  { title: "eCard", dataIndex: "ecards", key: "ecards", align: "right" },
  { title: "QR Bank", dataIndex: "banks", key: "banks", align: "right" },
  { title: "Thiết bị", dataIndex: "devices", key: "devices", align: "right" },
  {
    title: "Thấy lần cuối",
    dataIndex: "lastSeen",
    key: "lastSeen",
    render: (value: unknown) => formatDateTime(value),
  },
];

export function UsersView() {
  const { data, error, loading, reload } = useLoad("users", loadUsers);
  const [search, setSearch] = useState("");

  const rows = (data ?? []).filter((row) =>
    row.email.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="admin-view">
      {error ? <Alert showIcon type="error" message="Không tải được danh sách" description={error} /> : null}
      <Card
        title={`Người dùng (${rows.length})`}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              allowClear
              placeholder="Tìm theo email"
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 240 }}
            />
            <Button icon={<ReloadOutlined />} onClick={reload} loading={loading} />
          </div>
        }
      >
        <Table columns={columns} dataSource={rows} loading={loading} pagination={{ pageSize: 20 }} scroll={{ x: 760 }} />
      </Card>
    </div>
  );
}
