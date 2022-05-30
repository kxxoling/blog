const H1: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return <h1 className="">{children}</h1>
}

const Image: React.FC = (props) => {
  return <img {...props} className="mx-auto max-w-80" />
}

const H2: React.FC<{ children: JSX.Element }> = (props) => {
  return <h2 className="">§ {props.children}</h2>
}

const modules = {
  img: Image,
  h1: H1,
  h2: H2,
}
export default modules
