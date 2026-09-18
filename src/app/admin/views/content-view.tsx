"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  message,
  type TableColumnsType,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  formatDateTime,
  fromDateTimeLocalValue,
  getErrorMessage,
  toDateTimeLocalValue,
} from "./format";
import { useLoad } from "./use-load";

type NotificationType = "normal" | "system";

type NotificationRow = {
  key: string;
  title: string;
  shortBody: string;
  detailTitle: string;
  detailBody: string;
  type: NotificationType;
  isActive: boolean;
  startsAt: unknown;
  endsAt: unknown;
  publishedAt: unknown;
  thumbnailUrl: string;
  imageUrl: string;
  actionTitle: string;
  actionUrl: string;
};

type FormValues = {
  title: string;
  shortBody: string;
  detailTitle: string;
  detailBody: string;
  type: NotificationType;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  publishedAt: string;
  thumbnailUrl: string;
  imageUrl: string;
  actionTitle: string;
  actionUrl: string;
};

async function loadNotifications() {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firebase chưa được cấu hình.");
  }

  const snap = await getDocs(
    query(collection(db, "notifications"), orderBy("published_at", "desc"), limit(200)),
  );

  return snap.docs.map<NotificationRow>((item) => ({
    key: item.id,
    title: (item.get("title") as string) || "",
    shortBody: (item.get("short_body") as string) || "",
    detailTitle: (item.get("detail_title") as string) || "",
    detailBody: (item.get("detail_body") as string) || "",
    type: item.get("type") === "system" ? "system" : "normal",
    isActive: item.get("is_active") === true,
    startsAt: item.get("starts_at"),
    endsAt: item.get("ends_at"),
    publishedAt: item.get("published_at"),
    thumbnailUrl: (item.get("thumbnail_url") as string) || "",
    imageUrl: (item.get("image_url") as string) || "",
    actionTitle: (item.get("action_title") as string) || "",
    actionUrl: (item.get("action_url") as string) || "",
  }));
}

const emptyValues = (): FormValues => ({
  title: "",
  shortBody: "",
  detailTitle: "",
  detailBody: "",
  type: "normal",
  isActive: true,
  startsAt: toDateTimeLocalValue(new Date()),
  endsAt: "",
  publishedAt: toDateTimeLocalValue(new Date()),
  thumbnailUrl: "",
  imageUrl: "",
  actionTitle: "",
  actionUrl: "",
});

const toFormValues = (row: NotificationRow): FormValues => ({
  title: row.title,
  shortBody: row.shortBody,
  detailTitle: row.detailTitle,
  detailBody: row.detailBody,
  type: row.type,
  isActive: row.isActive,
  startsAt: toDateTimeLocalValue(row.startsAt),
  endsAt: toDateTimeLocalValue(row.endsAt),
  publishedAt: toDateTimeLocalValue(row.publishedAt),
  thumbnailUrl: row.thumbnailUrl,
  imageUrl: row.imageUrl,
  actionTitle: row.actionTitle,
  actionUrl: row.actionUrl,
});

function toTimestamp(value: string, fallback: Date | null) {
  const date = fromDateTimeLocalValue(value) ?? fallback;
  return date ? Timestamp.fromDate(date) : null;
}

export function ContentView() {
  const { data, error, loading, reload } = useLoad("notifications", loadNotifications);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<FormValues>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<NotificationRow | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    form.setFieldsValue(emptyValues());
    setDrawerOpen(true);
  }

  function openEdit(row: NotificationRow) {
    setEditing(row);
    form.setFieldsValue(toFormValues(row));
    setDrawerOpen(true);
  }

  async function handleSubmit(values: FormValues) {
    const db = getFirebaseDb();
    if (!db) {
      return;
    }

    setSaving(true);
    try {
      const now = new Date();
      const payload = {
        title: values.title.trim(),
        short_body: values.shortBody.trim(),
        detail_title: values.detailTitle.trim(),
        detail_body: values.detailBody.trim(),
        type: values.type,
        is_active: values.isActive,
        starts_at: toTimestamp(values.startsAt, now),
        ends_at: toTimestamp(values.endsAt, null),
        published_at: toTimestamp(values.publishedAt, now),
        thumbnail_url: values.thumbnailUrl.trim(),
        image_url: values.imageUrl.trim(),
        action_title: values.actionTitle.trim(),
        action_url: values.actionUrl.trim(),
        updated_at: serverTimestamp(),
      };

      if (editing) {
        await updateDoc(doc(db, "notifications", editing.key), payload);
      } else {
        await addDoc(collection(db, "notifications"), {
          ...payload,
          created_at: serverTimestamp(),
        });
      }

      messageApi.success(editing ? "Đã cập nhật thông báo." : "Đã tạo thông báo.");
      setDrawerOpen(false);
      reload();
    } catch (saveError) {
      messageApi.error(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(row: NotificationRow, isActive: boolean) {
    const db = getFirebaseDb();
    if (!db) {
      return;
    }

    try {
      await updateDoc(doc(db, "notifications", row.key), {
        is_active: isActive,
        updated_at: serverTimestamp(),
      });
      reload();
    } catch (toggleError) {
      messageApi.error(getErrorMessage(toggleError));
    }
  }

  async function handleDelete(row: NotificationRow) {
    const db = getFirebaseDb();
    if (!db) {
      return;
    }

    try {
      await deleteDoc(doc(db, "notifications", row.key));
      messageApi.success("Đã xoá thông báo.");
      reload();
    } catch (deleteError) {
      messageApi.error(getErrorMessage(deleteError));
    }
  }

  const columns: TableColumnsType<NotificationRow> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value: string, row) => (
        <div>
          <strong>{value}</strong>
          <div style={{ color: "#667085" }}>{row.shortBody}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (value: NotificationType) => (
        <Tag color={value === "system" ? "orange" : "blue"}>
          {value === "system" ? "Hệ thống" : "Thông thường"}
        </Tag>
      ),
    },
    {
      title: "Hiển thị",
      key: "isActive",
      render: (_value, row) => (
        <Switch checked={row.isActive} onChange={(checked) => handleToggle(row, checked)} />
      ),
    },
    {
      title: "Thời gian hiển thị",
      key: "window",
      render: (_value, row) => (
        <div>
          <div>Từ: {formatDateTime(row.startsAt)}</div>
          <div>Đến: {row.endsAt ? formatDateTime(row.endsAt) : "Không giới hạn"}</div>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_value, row) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button size="small" onClick={() => openEdit(row)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xoá thông báo này?"
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(row)}
          >
            <Button danger size="small">
              Xoá
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-view">
      {contextHolder}
      {error ? <Alert showIcon type="error" message="Không tải được thông báo" description={error} /> : null}

      <Card
        title={`Thông báo trong app (${data?.length ?? 0})`}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={reload} loading={loading} />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Tạo thông báo
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={data ?? []}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
          locale={{ emptyText: "Chưa có thông báo nào" }}
        />
      </Card>

      <Drawer
        title={editing ? "Sửa thông báo" : "Tạo thông báo"}
        size="large"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnHidden
        extra={
          <Button type="primary" loading={saving} onClick={() => form.submit()}>
            Lưu
          </Button>
        }
      >
        <Form<FormValues> form={form} layout="vertical" initialValues={emptyValues()} onFinish={handleSubmit}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input maxLength={120} />
          </Form.Item>
          <Form.Item name="shortBody" label="Nội dung ngắn (hiện ở danh sách)">
            <Input.TextArea rows={2} maxLength={300} />
          </Form.Item>
          <Form.Item name="detailTitle" label="Tiêu đề chi tiết (mặc định dùng tiêu đề)">
            <Input maxLength={160} />
          </Form.Item>
          <Form.Item name="detailBody" label="Nội dung chi tiết">
            <Input.TextArea rows={6} maxLength={4000} />
          </Form.Item>
          <Form.Item name="type" label="Loại">
            <Select
              options={[
                { value: "normal", label: "Thông thường (tab Thông báo)" },
                { value: "system", label: "Hệ thống (mục thông báo hệ thống)" },
              ]}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Đang hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="publishedAt" label="Ngày đăng">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="startsAt" label="Bắt đầu hiển thị">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="endsAt" label="Kết thúc hiển thị (bỏ trống nếu không giới hạn)">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="thumbnailUrl" label="Ảnh nhỏ (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="Ảnh lớn (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="actionTitle" label="Nút hành động (chữ trên nút)">
            <Input maxLength={40} />
          </Form.Item>
          <Form.Item name="actionUrl" label="Link của nút hành động">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
