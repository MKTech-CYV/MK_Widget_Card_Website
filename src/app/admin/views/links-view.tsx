"use client";

import { useState } from "react";
import { Alert, Button, Card, Popconfirm, Table, Tag, message, type TableColumnsType } from "antd";
import { CopyOutlined, LinkOutlined, ReloadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { adminFetch } from "./api";
import { formatDateTime, getErrorMessage } from "./format";
import { useLoad } from "./use-load";

type LinkRow = {
  code: string;
  url: string;
  preset_id: string;
  uid: string;
  owner_email: string;
  full_name: string;
  label: string;
  preset_missing: boolean;
  created_at: string | null;
};

type LinksResponse = {
  links: LinkRow[];
  presets_total: number;
  presets_missing_link: number;
};

async function loadLinks() {
  return (await adminFetch("/api/admin/share-links", { method: "GET" })) as LinksResponse;
}

export function LinksView() {
  const { data, error, loading, reload } = useLoad("links", loadLinks);
  const [messageApi, contextHolder] = message.useMessage();
  const [backfilling, setBackfilling] = useState(false);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      messageApi.success("Đã sao chép link.");
    } catch {
      messageApi.error("Không sao chép được.");
    }
  }

  async function backfill() {
    setBackfilling(true);
    try {
      const result = (await adminFetch("/api/admin/share-links", { method: "POST" })) as {
        created: number;
        remaining: number;
      };
      messageApi.success(
        result.remaining > 0
          ? `Đã tạo ${result.created} link, còn ${result.remaining} eCard nữa. Bấm lại để tiếp tục.`
          : `Đã tạo ${result.created} link.`,
      );
      reload();
    } catch (requestError) {
      messageApi.error(getErrorMessage(requestError));
    } finally {
      setBackfilling(false);
    }
  }

  const columns: TableColumnsType<LinkRow> = [
    {
      title: "Link ngắn",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href={url} target="_blank" rel="noreferrer">
            {url.replace(/^https?:\/\//, "")}
          </a>
          <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copy(url)} />
        </div>
      ),
    },
    {
      title: "eCard",
      key: "card",
      render: (_: unknown, row) =>
        row.preset_missing ? (
          <Tag color="red">eCard đã bị xoá</Tag>
        ) : (
          row.full_name || row.label || "—"
        ),
    },
    { title: "Chủ sở hữu", dataIndex: "owner_email", key: "owner", render: (value: string) => value || "—" },
    {
      title: "Tạo lúc",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string | null) => formatDateTime(value),
    },
  ];

  const missing = data?.presets_missing_link ?? 0;

  return (
    <div className="admin-view">
      {contextHolder}
      {error ? <Alert showIcon type="error" message="Không tải được danh sách link" description={error} /> : null}
      {missing > 0 ? (
        <Alert
          showIcon
          type="warning"
          message={`${missing} eCard chưa có link ngắn`}
          description="Thường là eCard tạo bằng bản app cũ. Bấm để tạo link cho tất cả."
          action={
            <Popconfirm
              title="Tạo link ngắn cho các eCard còn thiếu?"
              okText="Tạo link"
              cancelText="Huỷ"
              onConfirm={backfill}
            >
              <Button type="primary" icon={<ThunderboltOutlined />} loading={backfilling}>
                Tạo link còn thiếu
              </Button>
            </Popconfirm>
          }
        />
      ) : null}
      <Card
        title={
          <span>
            <LinkOutlined /> Link chia sẻ ({data?.links.length ?? 0}
            {data ? ` / ${data.presets_total} eCard` : ""})
          </span>
        }
        extra={<Button icon={<ReloadOutlined />} onClick={reload} loading={loading} />}
      >
        <Table
          rowKey="code"
          columns={columns}
          dataSource={data?.links ?? []}
          loading={loading}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 700 }}
          locale={{ emptyText: "Chưa có link nào" }}
        />
      </Card>
    </div>
  );
}
