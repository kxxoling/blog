export default function Page404(): JSX.Element {
  return (
    <div className="flex h-full items-center  bg-[rgba(0,0,0,0.1)]">
      <div className="grow p-8 leading-loose text-gray-200">
        <h1 className="text-bold mb-4 text-center text-3xl">404</h1>
        <p className="text-center">抱歉，您访问的页面并不存在。</p>
      </div>
    </div>
  )
}
