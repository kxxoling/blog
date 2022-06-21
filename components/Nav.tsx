import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="p-3 nav border-bottom">
      <Link href="/" passHref>
        <h2 className="pointer">Kane Blueriver</h2>
      </Link>

      <Link href="/bio" passHref>
        <p className="my-auto pointer ms-5 lead">Bio</p>
      </Link>
    </nav>
  )
}

export default Nav
