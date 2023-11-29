const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="inline-block px-2 rounded-md bg-blue-300 text-blue-700">
    {children}
  </span>
)

export default Badge
