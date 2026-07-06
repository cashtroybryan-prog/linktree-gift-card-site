export default function Page() {
  return (
    <main className="min-h-screen bg-[#f3f3f1] flex items-center justify-center px-6 text-center">
      <div className="w-full max-w-[720px] rounded-[42px] bg-white px-10 py-14 shadow-[0_24px_90px_rgba(0,0,0,0.14)]">
        <img
          src="/images/linktree-logo.png"
          alt="Linktree"
          className="mx-auto mb-10 h-auto w-[180px]"
        />

        <div className="mx-auto mb-8 flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#ff4d4d] text-[34px] font-black text-white">
          !
        </div>

        <h1 className="text-[56px] leading-[0.9] font-black tracking-[-2.5px] text-black">
          Payment was not completed
        </h1>

        <p className="mx-auto mt-6 max-w-[560px] text-[20px] leading-[1.25] font-bold text-[#555555]">
          No payment has been taken. You can try again or return home.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="../shop"
            className="flex h-[58px] items-center justify-center rounded-full bg-[#ccff00] px-10 text-[18px] font-black text-black no-underline"
          >
            Try again
          </a>

          <a
            href="../home"
            className="flex h-[58px] items-center justify-center rounded-full bg-black px-10 text-[18px] font-black text-white no-underline"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}