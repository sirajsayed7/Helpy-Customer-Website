import { useMemo, useState } from "react";
import {
  Search,
  ChevronRight,
  CalendarDays,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";
import { useNav } from "../context/NavContext";
import { useHelpyData } from "../context/HelpyDataContext";
import { hasHelpyUserSession } from "../api/helpy";

const statusClass: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-600",
  "In progress": "bg-amber-100 text-amber-600",
  Completed: "bg-blue-100 text-blue-600",
};

export default function OrdersPage() {
  const { navigate, bookedServices } = useNav();
  const data = useHelpyData();
  const [tab, setTab] = useState<"active" | "completed">("active");
  const orders = useMemo(
    () => [
      ...bookedServices.map((item) => ({
        ...item,
        address: item.address || "Doha, Qatar",
        image: item.providerImage,
      })),
      ...data.bookings,
    ],
    [bookedServices, data.bookings],
  );
  const filtered = orders.filter((item) =>
    tab === "completed"
      ? item.status === "Completed"
      : item.status !== "Completed",
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#edf7ff]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcff_0%,#edf7ff_46%,#f3f8ff_100%)]" />
      <div className="relative z-10 flex items-center justify-between px-5 pb-3 pt-3">
        <div>
          <h1 className="text-[24px] font-black text-gray-950">My bookings</h1>
          <p className="mt-0.5 text-[12px] text-gray-500">
            Track your live booking updates.
          </p>
        </div>
        <button
          onClick={() => navigate("all-services")}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm"
        >
          <Search size={17} className="text-gray-500" />
        </button>
      </div>
      <div className="relative z-10 mb-4 px-4">
        <div className="flex gap-1 rounded-2xl bg-gray-100 p-1">
          {(["active", "completed"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold transition-all ${tab === value ? "bg-white text-brand-500 shadow-sm" : "text-gray-500"}`}
            >
              {value === "active" ? "Active" : "Completed"}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex-1 space-y-3 overflow-y-auto px-4 pb-36">
        {data.accountLoading && (
          <p className="py-12 text-center text-[13px] font-bold text-[#65708a]">
            Loading bookings…
          </p>
        )}
        {!data.accountLoading && !hasHelpyUserSession() && (
          <Empty
            title="Sign in to view your bookings"
            action="Sign in"
            onClick={() => navigate("login")}
          />
        )}
        {!data.accountLoading &&
          hasHelpyUserSession() &&
          filtered.length === 0 && (
            <Empty
              title={
                tab === "active"
                  ? "No active bookings"
                  : "No completed bookings"
              }
              action="Browse businesses"
              onClick={() => navigate("providers")}
            />
          )}
        {filtered.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate("order-detail", { booking: order })}
            className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition active:scale-[.99]"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-sm font-black text-[#0967ff]">
                {order.image ? (
                  <img
                    src={order.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  order.provider.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[14px] font-black text-gray-950">
                    {order.provider}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusClass[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] font-bold text-brand-500">
                  {order.service}
                </p>
                <p className="mt-1.5 text-[11px] text-gray-500">
                  <CalendarDays
                    size={12}
                    className="mr-1 inline text-gray-400"
                  />
                  {order.date || "Date to be confirmed"} ·{" "}
                  {order.time || "Time to be confirmed"}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  <MapPin size={12} className="mr-1 inline text-gray-400" />
                  {order.address || "Address to be confirmed"}
                </p>
              </div>
              <ChevronRight size={15} className="mt-1 shrink-0 text-gray-300" />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
              <p className="text-[15px] font-black text-gray-950">
                {Number(order.price || 0).toFixed(2)} QR
              </p>
              {order.status !== "Completed" ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate("chat-thread", {
                      id: order.id,
                      name: order.provider,
                      providerImage: order.image,
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-[12px] font-bold text-brand-500"
                >
                  <MessageCircle size={13} />
                  Message
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-amber-500">
                  <Star size={13} />
                  Completed
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Empty({
  title,
  action,
  onClick,
}: {
  title: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm">
        <CalendarDays className="text-brand-500" />
      </div>
      <p className="text-[14px] font-semibold text-gray-500">{title}</p>
      <button
        onClick={onClick}
        className="text-[13px] font-bold text-brand-500"
      >
        {action}
      </button>
    </div>
  );
}
