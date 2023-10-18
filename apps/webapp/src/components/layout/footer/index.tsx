export default async function Footer() {
  return (
    <footer className="bg-neutral-20 text-sm text-neutral-500 dark:text-neutral-400 w-full">
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>CryptoVC</p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>ETHOnline 2023</p>
          <p className="md:ml-auto">
            <a href="https://vercel.com" className="text-black dark:text-white">
              Inspired by ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
