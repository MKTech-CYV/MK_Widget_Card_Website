"use client";

import { useState } from "react";
import { Alert, Button, Card, Segmented, Table, Tag, type TableColumnsType } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { formatDateTime, formatDevice, formatLocation } from "./format";
import { useLoad } from "./use-load";

type PlatformFilter = "all" | "ios" | "android";

type DeviceRow = {
  key: string;
  email: string;
  device: string;
  platform: string;
  osVersion: string;
  appVersion: string;
  ip: string;
  location: string;
  logins: number;
  lastSeen: unknown;
};

async function loadDevices(platform: PlatformFilter) {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase chưa được cấu hình.");
  }

  const devices = collection(db, "devices");
  const snap = await getDocs(
    platform === "all"
      ? query(devices, orderBy("last_seen_at", "desc"), limit(200))
      : query(
          devices,
          where("platform", "==", platform),
          orderBy("last_seen_at", "desc"),
          limit(200),
        ),
  );

  return snap.docs.map<DeviceRow>((doc) => ({
    key: doc.id,
    email: (doc.get("email") as string) || "—",
    device: formatDevice(doc.get("device_brand"), doc.get("device_model")),
    platform: (doc.get("platform") as string) || "—",
    osVersion: [doc.get("os_name"), doc.get("os_version")].filter(Boolean).join(" ") || "—",
    appVersion: (doc.get("app_runtime_version") as string) || "—",
    ip: (doc.get("last_ip") as string) || "—",
    location: formatLocation(doc.get("last_country"), doc.get("last_region"), doc.get("last_city")),
    logins: (doc.get("login_count") as number) ?? 0,
    lastSeen: doc.get("last_seen_at"),
  }));
}

const columns: TableColumnsType<DeviceRow> = [
  { title: "Người dùng", dataIndex: "email", key: "email" },
  { title: "Thiết bị", dataIndex: "device", key: "device" },
  {
    title: "Nền tảng",
    dataIndex: "platform",
    key: "platform",
    render: (value: string) => <Tag color={value === "ios" ? "blue" : value === "android" ? "green" : undefined}>{value}</Tag>,
  },
  { title: "Hệ điều hành", dataIndex: "osVersion", key: "osVersion" },
  { title: "Phiên bản app", dataIndex: "appVersion", key: "appVersion" },
  { title: "IP gần nhất", dataIndex: "ip", key: "ip" },
  { title: "Vị trí (gần đúng)", dataIndex: "location", key: "location" },
  { title: "Lần đăng nhập", dataIndex: "logins", key: "logins", align: "right" },
  {
    title: "Thấy lần cuối",
    dataIndex: "lastSeen",
    key: "lastSeen",
    render: (value: unknown) => formatDateTime(value),
  },
];

export function DevicesView() {
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const { data, error, loading, reload } = useLoad(`devices:${platform}`, () =>
    loadDevices(platform),
  );

  return (
    <div className="admin-view">
      {error ? <Alert showIcon type="error" message="Không tải được danh sách thiết bị" description={error} /> : null}
      <Card
        title={`Thiết bị (${data?.length ?? 0})`}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <Segmented<PlatformFilter>
              value={platform}
              onChange={setPlatform}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "iOS", value: "ios" },
                { label: "Android", value: "android" },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={reload} loading={loading} />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={data ?? []}
          loading={loading}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1100 }}
          locale={{ emptyText: "Chưa có thiết bị nào" }}
        />
      </Card>
    </div>
  );
}
