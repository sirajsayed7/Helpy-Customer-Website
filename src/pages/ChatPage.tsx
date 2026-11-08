import { useEffect, useMemo, useState } from "react";
import { Search, ChevronRight, MessageCircle, RefreshCw } from "lucide-react";
import { useNav } from "../context/NavContext";
import { hasHelpyUserSession } from "../api/helpy";
import { helpyChat, type ChatUser } from "../api/chat";

export default function ChatPage() {
  const { navigate } = useNav();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    if (!hasHelpyUserSession() || !helpyChat.configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setUsers(await helpyChat.getUsers());
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load messages.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const shown = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [users, query],
  );
  const signedIn = hasHelpyUserSession();
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#edf7ff]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcff_0%,#edf7ff_46%,#f3f8ff_100%)]" />
      <div className="relative z-10 flex items-start justify-between px-5 pb-3 pt-3">
        <div>
          <h1 className="text-[24px] font-black text-gray-950">Messages</h1>
          <p className="mt-0.5 text-[12px] text-gray-500">
            Private conversations with providers and support.
          </p>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading || !helpyChat.configured}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm disabled:opacity-40"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin text-[#0967ff]" : "text-[#65708a]"
            }
          />
        </button>
      </div>
      {signedIn && (
        <div className="relative z-10 mx-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"
          />
        </div>
      )}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-36 pt-3">
        <div className="divide-y divide-gray-50 overflow-hidden rounded-2xl bg-white shadow-sm">
          {!signedIn && (
            <Empty
              title="Sign in to open your messages"
              action="Sign in"
              onClick={() => navigate("login")}
            />
          )}
          {signedIn && loading && (
            <p className="px-4 py-10 text-center text-[13px] font-bold text-[#65708a]">
              Connecting to messages…
            </p>
          )}
          {signedIn && !loading && !helpyChat.configured && (
            <Empty
              title="Messaging isn’t configured for this website yet"
              action="Back to home"
              onClick={() => navigate("home")}
            />
          )}
          {signedIn && !loading && helpyChat.configured && !shown.length && (
            <Empty
              title={
                query
                  ? "No conversations found"
                  : "Your provider conversations will appear here"
              }
              action={query ? "Clear search" : "Browse businesses"}
              onClick={() => (query ? setQuery("") : navigate("providers"))}
            />
          )}
          {shown.map((user) => (
            <button
              key={user.id}
              onClick={() =>
                navigate("chat-thread", {
                  peerId: user.id,
                  name: user.name,
                  providerImage: user.image,
                  online: user.online,
                })
              }
              className="flex w-full items-start gap-3 p-4 text-left active:bg-gray-50"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-sm font-black text-[#0967ff]">
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-black text-gray-950">
                  {user.name}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] text-gray-500">
                  {user.about || user.email || "Helpy business"}
                </p>
              </div>
              {user.online && (
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
              )}
              <ChevronRight size={15} className="mt-1 text-gray-300" />
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-3 rounded-xl bg-red-50 p-3 text-center text-[12px] font-semibold text-red-600">
            {error}
          </p>
        )}
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
    <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
      <MessageCircle size={30} className="text-[#8ba4c8]" />
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
