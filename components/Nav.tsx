import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="nav p-3 border-bottom">
      <Link href="/" passHref>
        <h2 className="pointer">Kane Blueriver</h2>
      </Link>

      <Link href="/bio" passHref>
        <p className="pointer ms-5 lead my-auto">Bio</p>
      </Link>
    </nav>
  )
}

export default Nav
