"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Input, Table, Tag, type TableColumnsType } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  formatDateTime,
  formatDevice,
  formatLocation,
  getErrorMessage,
  providerLabel,
} from "./format";

const PAGE_SIZE = 50;

type LoginRow = {
  key: string;
  createdAt: unknown;
  email: string;
  provider: string;
  device: string;
  ip: string;
  location: string;
};

type Page = {
  rows: LoginRow[];
  cursor: QueryDocumentSnapshot | null;
  hasMore: boolean;
};

async function fetchPage(cursor: QueryDocumentSnapshot | null): Promise<Page> {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase chưa được cấu hình.");
  }

  const events = collection(db, "login_events");
  const snap = await getDocs(
    cursor
      ? query(events, orderBy("created_at", "desc"), startAfter(cursor), limit(PAGE_SIZE))
      : query(events, orderBy("created_at", "desc"), limit(PAGE_SIZE)),
  );

  return {
    rows: snap.docs.map<LoginRow>((doc) => ({
      key: doc.id,
      createdAt: doc.get("created_at"),
      email: (doc.get("email") as string) || "—",
      provider: providerLabel(doc.get("provider")),
      device: `${formatDevice(null, doc.get("device_model"))}${doc.get("platform") ? ` (${doc.get("platform")})` : ""}`,
      ip: (doc.get("ip") as string) || "—",
      location: formatLocation(doc.get("country"), doc.get("region"), doc.get("city")),
    })),
    cursor: snap.docs.at(-1) ?? null,
    hasMore: snap.size === PAGE_SIZE,
  };
}

const columns: TableColumnsType<LoginRow> = [
  {
    title: "Thời gian",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: unknown) => formatDateTime(value),
  },
  { title: "Người dùng", dataIndex: "email", key: "email" },
  {
    title: "Phương thức",
    dataIndex: "provider",
    key: "provider",
    render: (value: string) => <Tag>{value}</Tag>,
  },
  { title: "Thiết bị", dataIndex: "device", key: "device" },
  { title: "IP", dataIndex: "ip", key: "ip" },
  { title: "Vị trí (gần đúng)", dataIndex: "location", key: "location" },
];

export function LoginsView() {
  const [page, setPage] = useState<Page | null>(null);
  const [rows, setRows] = useState<LoginRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchPage(null)
      .then((first) => {
        if (!cancelled) {
          setPage(first);
          setRows(first.rows);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(loadError));
          setPage({ rows: [], cursor: null, hasMore: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function reload() {
    setPage(null);
    setRows([]);
    setReloadKey((value) => value + 1);
  }

  async function loadMore() {
    if (!page?.cursor) {
      return;
    }

    setLoadingMore(true);
    try {
      const next = await fetchPage(page.cursor);
      setPage(next);
      setRows((current) => [...current, ...next.rows]);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoadingMore(false);
    }
  }

  const needle = search.trim().toLowerCase();
  const visible = needle
    ? rows.filter((row) => row.email.toLowerCase().includes(needle) || row.ip.includes(needle))
    : rows;

  return (
    <div className="admin-view">
      {error ? <Alert showIcon type="error" message="Không tải được lịch sử đăng nhập" description={error} /> : null}
      <Card
        title={`Lịch sử đăng nhập (đã tải ${rows.length})`}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <Input.Search
              allowClear
              placeholder="Lọc theo email hoặc IP (trong dữ liệu đã tải)"
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 320 }}
            />
            <Button icon={<ReloadOutlined />} onClick={reload} loading={page === null} />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={visible}
          loading={page === null}
          pagination={false}
          scroll={{ x: 900 }}
          locale={{ emptyText: "Chưa có lượt đăng nhập nào" }}
        />
        {page?.hasMore ? (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button onClick={loadMore} loading={loadingMore}>
              Tải thêm
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
