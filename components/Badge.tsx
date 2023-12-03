const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="inline-block rounded-md bg-blue-300 px-2 text-blue-700">
    {children}
  </span>
)

export default Badge
