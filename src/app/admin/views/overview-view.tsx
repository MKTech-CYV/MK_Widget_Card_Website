"use client";

import { Alert, Card, Spin, Statistic, Table, type TableColumnsType } from "antd";
import {
  LoginOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { User } from "firebase/auth";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
  type Query,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { formatDateTime } from "./format";
import { useLoad } from "./use-load";

const DAY_MS = 24 * 60 * 60 * 1000;
const VERSION_SAMPLE_SIZE = 500;

type VersionRow = { key: string; version: string; devices: number };

async function loadOverview() {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase chưa được cấu hình.");
  }

  const since = (days: number) =>
    Timestamp.fromMillis(Date.now() - days * DAY_MS);
  const count = async (source: Query) =>
    (await getCountFromServer(source)).data().count;
  const devices = collection(db, "devices");
  const logins = collection(db, "login_events");

  const [users, deviceTotal, logins24h, logins7d, ios, android, recent] =
    await Promise.all([
      count(collection(db, "profiles")),
      count(devices),
      count(query(logins, where("created_at", ">=", since(1)))),
      count(query(logins, where("created_at", ">=", since(7)))),
      count(query(devices, where("platform", "==", "ios"))),
      count(query(devices, where("platform", "==", "android"))),
      getDocs(
        query(devices, orderBy("last_seen_at", "desc"), limit(VERSION_SAMPLE_SIZE)),
      ),
    ]);

  const byVersion = new Map<string, number>();
  recent.docs.forEach((doc) => {
    const version = (doc.get("app_runtime_version") as string | null) ?? "Không rõ";
    byVersion.set(version, (byVersion.get(version) ?? 0) + 1);
  });

  const versions: VersionRow[] = [...byVersion.entries()]
    .map(([version, count]) => ({ key: version, version, devices: count }))
    .sort((a, b) => b.devices - a.devices);

  return { users, deviceTotal, logins24h, logins7d, ios, android, versions };
}

const versionColumns: TableColumnsType<VersionRow> = [
  { title: "Phiên bản app (runtime)", dataIndex: "version", key: "version" },
  { title: "Số thiết bị", dataIndex: "devices", key: "devices", align: "right" },
];

export function OverviewView({ user }: { user: User }) {
  const { data, error, loading } = useLoad("overview", loadOverview);

  if (loading) {
    return (
      <div className="admin-view">
        <Spin />
      </div>
    );
  }

  return (
    <div className="admin-view">
      {error ? (
        <Alert showIcon type="error" message="Không tải được số liệu" description={error} />
      ) : null}

      {data && data.deviceTotal === 0 ? (
        <Alert
          showIcon
          type="info"
          message="Chưa có dữ liệu thiết bị"
          description="Dữ liệu xuất hiện khi người dùng đăng nhập bằng bản app đã bật tính năng theo dõi thiết bị."
        />
      ) : null}

      <div className="admin-stats-grid">
        <Card>
          <Statistic title="Người dùng" value={data?.users ?? 0} prefix={<TeamOutlined />} />
        </Card>
        <Card>
          <Statistic title="Thiết bị" value={data?.deviceTotal ?? 0} prefix={<MobileOutlined />} />
        </Card>
        <Card>
          <Statistic title="Đăng nhập 24 giờ" value={data?.logins24h ?? 0} prefix={<LoginOutlined />} />
        </Card>
        <Card>
          <Statistic title="Đăng nhập 7 ngày" value={data?.logins7d ?? 0} prefix={<LoginOutlined />} />
        </Card>
        <Card>
          <Statistic title="iOS" value={data?.ios ?? 0} />
        </Card>
        <Card>
          <Statistic title="Android" value={data?.android ?? 0} />
        </Card>
        <Card>
          <Statistic title="Tài khoản admin" value={user.email ?? "User"} prefix={<SafetyCertificateOutlined />} />
        </Card>
        <Card>
          <Statistic title="Lần đăng nhập gần nhất" value={formatDateTime(user.metadata.lastSignInTime)} />
        </Card>
      </div>

      <Card title={`Phiên bản app (${VERSION_SAMPLE_SIZE} thiết bị hoạt động gần nhất)`}>
        <Table
          columns={versionColumns}
          dataSource={data?.versions ?? []}
          pagination={false}
          locale={{ emptyText: "Chưa có dữ liệu" }}
        />
      </Card>
    </div>
  );
}
