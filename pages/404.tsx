export default function Page404(): JSX.Element {
  return (
    <div className="flex items-center h-full  bg-[rgba(0,0,0,0.1)]">
      <div className="p-8 leading-loose text-gray-200 grow">
        <h1 className="mb-4 text-3xl text-center text-bold">404</h1>
        <p className="text-center">抱歉，您访问的页面并不存在。</p>
      </div>
    </div>
  )
}
