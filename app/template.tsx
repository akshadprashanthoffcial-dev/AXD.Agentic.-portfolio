// Re-mounts on every navigation → gives each page its settle-in entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
